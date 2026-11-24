import InterviewForm from "@/components/interview/interview-form";

export const metadata = {
  title: "TEWA Feature Interview",
  robots: { index: false, follow: false }, // private link, keep out of search
};

export default function InterviewPage() {
  return <InterviewForm />;
}
