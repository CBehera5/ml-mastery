import type {Metadata} from "next";
import pages from "./editorial-metadata.json";
const entries:Record<string,{title:string;description:string}>=pages;
/** Page-specific summaries; production canonical URLs require a configured public origin. */
export function editorialMetadata(route:string):Metadata { return entries[route]??{}; }
