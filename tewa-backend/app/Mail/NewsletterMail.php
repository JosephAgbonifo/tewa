<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subjectLine,
        public string $htmlBody,
        public string $unsubscribeToken,
    ) {}

    public function build()
    {
        $unsubscribeUrl = url("/api/newsletter/unsubscribe/{$this->unsubscribeToken}");

        return $this->subject($this->subjectLine)
            ->view('emails.newsletter')
            ->with([
                'htmlBody' => $this->htmlBody,
                'unsubscribeUrl' => $unsubscribeUrl,
            ]);
    }
}