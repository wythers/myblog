import React from "react";
import { DocSearch } from "@docsearch/react";
import { Input } from "@material-tailwind/react";
 
//TODO: take the below three variables to the config file as a prop
const APP_ID = "";
const INDEX_NAME = "";
const API_KEY = "";
 
export default function({mobile, closeDrawer}) {
  return (
  <>
    <div className={`${mobile ? 'block' : 'hidden lg:block'} group relative self-center`}>
      <Input variant="outlined"
        label="Search..." placeholder="Search..."
        className="!w-[275px] focus:!border-t-red-200 group-hover:border-2 group-hover:!border-red-200 dark:focus:!border-t-light-blue-200 dark:group-hover:!border-light-blue-200"
      readOnly
      />
      <div className="absolute top-[20px] right-2.5 -translate-y-2/4">
        <kbd className="rounded border border-blue-gray-100 bg-white px-1 pt-px pb-0 text-xs font-medium text-gray-900 shadow shadow-black/5">
          <span className="mr-0.5 inline-block">
            ⌘
          </span>
            K
        </kbd>
      </div>
      <div className="absolute inset-0 w-full opacity-0" onClick={ mobile ? () => closeDrawer() : () => {} }>
        <DocSearch indexName={INDEX_NAME} apiKey={API_KEY} appId={APP_ID} />
      </div>
    </div>
  </>
  );
}