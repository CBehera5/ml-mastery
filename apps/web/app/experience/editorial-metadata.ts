import type {Metadata} from "next";
import pages from "./editorial-metadata.json";
const entries:Record<string,{title:string;description:string}>=pages;
/** Page-specific summaries; production canonical URLs require a configured public origin. */
/** The root layout title template adds " | ML Mastery", so the stored suffix is removed here to avoid saying it twice. */
export function editorialMetadata(route:string):Metadata { const entry=entries[route]; return entry?{...entry,title:entry.title.replace(/ \| ML Mastery$/,"")}:{}; }
