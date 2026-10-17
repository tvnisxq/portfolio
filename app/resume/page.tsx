import fs from "node:fs";
import path from "node:path";

import EscButton from "@/components/EscButton";

export const metadata = { title: "resume · tanishq" };

export default function ResumePage() {
  const exists = fs.existsSync(path.join(process.cwd(), "public/resume.pdf"));

  return (
    <main className="wrap resume">
      <div className="resume-bar">
        <EscButton href="/" />
        {exists ? (
          <div className="resume-actions mono">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">open in new tab</a>
            <a href="/resume.pdf" download="Tanishq-Sharma-Resume.pdf" className="download">download</a>
          </div>
        ) : null}
      </div>

      {exists ? (
        <iframe
          src="/resume.pdf#toolbar=0&navpanes=0"
          title="Resume"
          className="resume-frame"
        />
      ) : (
        <p className="empty">
          Resume not added yet. Save your PDF as <code>public/resume.pdf</code> and redeploy.
        </p>
      )}
    </main>
  );
}
