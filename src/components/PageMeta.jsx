import { useEffect } from "react";
export default function PageMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    let meta = document.querySelector('meta[name="description"]');
    const existed = !!meta;
    const previousDescription = meta?.content;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    document.title = `${title} | Veltrixis`;
    meta.content = description;
    if (!window.location.hash) window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      if (existed) meta.content = previousDescription;
      else meta.remove();
    };
  }, [title, description]);
  return null;
}
