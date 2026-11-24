<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\NewsletterCampaign;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $subscriber = Subscriber::firstOrNew(['email' => $validated['email']]);

        if ($subscriber->exists && $subscriber->is_active) {
            return response()->json(['message' => 'You are already subscribed.'], 200);
        }

        $subscriber->is_active = true;
        $subscriber->subscribed_at = now();
        $subscriber->save();

        return response()->json(['message' => 'Subscribed successfully.'], 201);
    }

    public function unsubscribe(string $token)
    {
        $subscriber = Subscriber::where('unsubscribe_token', $token)->firstOrFail();
        $subscriber->update(['is_active' => false]);

        return response()->json(['message' => 'You have been unsubscribed.']);
    }

    public function subscribers(Request $request)
    {
        $subscribers = Subscriber::where('is_active', true)
            ->latest('subscribed_at')
            ->paginate($request->integer('per_page', 50));

        return response()->json($subscribers);
    }

    /**
     * POST /api/admin/newsletter/send
     * Sends synchronously within the request — no queue worker or cron
     * needed. Raises the PHP execution time limit for just this request
     * since sending to many subscribers can take longer than the default
     * timeout allows.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'html_body' => ['required', 'string'],
        ]);

        $subscribers = Subscriber::where('is_active', true)->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'No active subscribers to send to.'], 422);
        }

        // Give this specific request more room to finish sending before
        // the host's default PHP timeout would otherwise kill it.
        // set_time_limit(0) means "no limit" but some shared hosts disable
        // this function entirely — wrapped so it fails silently if so.
        if (function_exists('set_time_limit')) {
            @set_time_limit(300); // 5 minutes
        }

        $campaign = NewsletterCampaign::create([
            'subject' => $validated['subject'],
            'html_body' => $validated['html_body'],
            'recipients_count' => $subscribers->count(),
        ]);

        $sentCount = 0;
        $failed = [];

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(
                    new NewsletterMail($campaign->subject, $campaign->html_body, $subscriber->unsubscribe_token)
                );
                $sentCount++;
            } catch (\Throwable $e) {
                $failed[] = $subscriber->email;
            }
        }

        $campaign->update([
            'sent_at' => now(),
            'recipients_count' => $sentCount,
        ]);

        return response()->json([
            'message' => "Newsletter sent to {$sentCount} subscriber" . ($sentCount === 1 ? '' : 's') . '.' .
                (count($failed) > 0 ? ' ' . count($failed) . ' failed to send.' : ''),
            'campaign' => $campaign,
            'failed_emails' => $failed,
        ]);
    }

    public function campaigns()
    {
        return response()->json(NewsletterCampaign::latest()->paginate(20));
    }
}