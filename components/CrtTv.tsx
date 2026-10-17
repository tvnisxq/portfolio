import fs from "node:fs";
import path from "node:path";

const EXTS = ["jpg", "jpeg", "png", "webp"];

// Chrome TV frame with your photo on the screen. Put your photo at public/me.jpg (or .png/.webp).
export default function CrtTv() {
  const ext = EXTS.find((e) => fs.existsSync(path.join(process.cwd(), `public/me.${e}`)));

  return (
    <figure className="crt">
      <div className="crt-screen">
        {ext ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/me.${ext}`} alt="Portrait of Tanishq" className="crt-photo" />
        ) : (
          <div className="crt-nosignal mono">
            no signal
            <br />
            add public/me.jpg
          </div>
        )}
        <span className="crt-fx" aria-hidden="true" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/crt-tv.webp" alt="" aria-hidden="true" className="crt-frame" />
    </figure>
  );
}
