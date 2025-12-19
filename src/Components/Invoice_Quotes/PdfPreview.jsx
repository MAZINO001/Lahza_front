/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfPreview({ src }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revoke;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(src, { responseType: "blob" });
        const url = URL.createObjectURL(res.data);
        setBlobUrl(url);
        revoke = () => URL.revokeObjectURL(url);
      } catch (e) {
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    }
    if (src) load();
    return () => {
      if (revoke) revoke();
    };
  }, [src]);

  const onLoadSuccess = ({ numPages: n }) => setNumPages(n);

  if (loading)
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        Loading PDF…
      </div>
    );
  if (error) return <div style={{ color: "red", padding: 16 }}>{error}</div>;
  if (!blobUrl) return null;

  return (
    <div className="flex items-start justify-between min-h-screen bg-background py-0 border border-border rounded-lg overflow-hidden">
      <Document
        file={blobUrl}
        onLoadSuccess={onLoadSuccess}
        loading={null}
        error={null}
      >
        <Page
          pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.5}
        />
      </Document>
    </div>
  );
}
