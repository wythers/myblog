import { useState } from "react"
import { CodeBlock, dracula, github } from "react-code-blocks";
import { ClipboardDocumentListIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import { useCopyToClipboard } from "usehooks-ts";
import { IconButton } from "@material-tailwind/react";

export default function ({ InitTab, dark, files }) {
  const tabs = Object.keys(files);
  const [curTab, setCurTab] = useState(InitTab)

  return (
    <div className="relative flex flex-col w-full rounded-md">
      <div className="relative pt-2 px-2 codeblock-tab flex flex-nowrap flex-row whitespace-nowrap rounded-t-md bg-gray-300 dark:bg-gray-700 text-black dark:text-white overflow-x-auto overflow-y-hidden scrollbar-hide w-full">
        {
          tabs.map((tab, idx) => {
            if (tab != curTab) {
              return <button key={idx} className="relative h-full p-2 bg-transparent text-center border-b-[1px] border-black" onClick={() => setCurTab(tab)}>
                {tab}
              </button>
            }

            return <button key={idx} className="relative bg-white dark:bg-[#282a36] p-2 h-full text-center rounded-t-md border-x-[1px] border-t-[1px] border-black" onClick={() => setCurTab(tab)}>
              {tab}
            </button>
          })

        }
        <div className="grow border-b-[1px] border-black" />
      </div>

      <Code dark={dark} file={files[curTab]} curTab={curTab} />

      <div className="w-full h-[25px] bg-gray-300 dark:bg-gray-700 rounded-b-lg" />
    </div>
  )
}

function Code({ dark, file }) {
  const [copied, setCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  return (
    <div className="relative codeblock w-full">
      {
        !copied ?
          <IconButton className="!absolute right-2 top-2" onClick={
            () => {
              copy(file[0]);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }>
            <ClipboardDocumentListIcon className="w-6 h-6" />
          </IconButton> :
          <IconButton className="!absolute right-2 top-2" onClick={() => { }}>
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          </IconButton>
      }
      <CodeBlock
        codeContainerStyle={{width: '100%'}}
        language={file[1]}
        text={file[0]}
        showLineNumbers={true}
        theme={dark ? dracula : github}
        codeBlock
      />
    </div>
  )
}
