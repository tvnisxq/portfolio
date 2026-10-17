import fs from "node:fs";
import path from "node:path";
import PhotoTilt from "./PhotoTilt";

const EXTS = ["jpg", "jpeg", "png", "webp"];

// Looks for public/me.jpg (or .jpeg / .png / .webp) and shows it.
export default function PhotoCard() {
  const ext = EXTS.find((e) => fs.existsSync(path.join(process.cwd(), `public/me.${e}`)));
  if (!ext) {
    return (
      <div className="photo photo-missing mono">
        add your photo
        <br />
        public/me.jpg
      </div>
    );
  }
  return <PhotoTilt src={`/me.${ext}`} alt="Portrait of Tanishq" />;
}
