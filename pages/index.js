import camelCase from "camelcase";
import { useEffect, useMemo, useState } from "react";

function camelCaseAttrs(str = "", attrs = []) {
  attrs.forEach((attr) => {
    str = str.replace(new RegExp(`${attr}`, "g"), camelCase(attr));
  });
  return str;
}

function transform(text = "") {
  return camelCaseAttrs(
    text
      .replace(/<!--/g, "{/*")
      .replace(/-->/g, "*/}")
      .replace(/for=\"/g, 'htmlFor="')
      .replace(/class="/g, 'className="'),
    [
      "clip-path",
      "fill-opacity",
      "font-family",
      "font-size",
      "gradient-transform",
      "gradient-units",
      "marker-end",
      "marker-mid",
      "marker-start",
      "pattern-content-units",
      "pattern-units",
      "preserve-aspect-ratio",
      "spread-method",
      "stop-color",
      "stop-opacity",
      "stroke-dasharray",
      "stroke-linecap",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "view-box",
      "xlink-actuate",
      "xlink-arcrole",
      "xlink-href",
      "xlink-role",
      "xlink-show",
      "xlink-title",
      "xlink-type",
      "xml-base",
      "xml-lang",
      "xml-space",
    ]
  );
}

export default function Home() {
  const [copyText, setCopyText] = useState("copy");
  const [beforeHTML, setBeforeHTML] = useState("");
  const afterHTML = useMemo(() => {
    return transform(beforeHTML);
  }, [beforeHTML]);

  const onBeforeChange = (e) => {
    setBeforeHTML(e.target.value);
  };

  const onCopy = (e) => {
    e.preventDefault();

    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(afterHTML).then(() => {
          setCopyText("copied");
          setTimeout(() => {
            setCopyText("copy");
          }, 1000);
        });
      }
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800 p-4">
      <div className="flex flex-row justify-between pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300">
          Tailwind UI HTML to React JSX
        </h2>
        <button
          type="button"
          id="copy"
          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500${
            beforeHTML === ""
              ? " cursor-not-allowed"
              : " hover:bg-indigo-200 dark:hover:bg-indigo-500"
          }`}
          onClick={onCopy}
          disabled={beforeHTML === ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="20"
            height="20"
            className="mr-1"
          >
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>{copyText}</span>
        </button>
      </div>
      <div className="flex flex-row h-full px-4 border-b border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-700">
        <div className="flex flex-col w-1/2 h-full px-4 py-5">
          <div className="h-1/2 flex flex-col">
            <label
              htmlFor="before"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Before
            </label>
            <textarea
              id="before"
              className="border border-gray-200 dark:border-gray-800 rounded h-full font-mono p-2 text-sm bg-transparent resize-none dark:text-gray-300"
              onChange={onBeforeChange}
            ></textarea>
          </div>
          <div className="h-1/2 flex flex-col">
            <label className="block pt-4 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div
              id="preview"
              className="h-full overflow-y-auto border border-gray-200 dark:border-gray-800 rounded"
              dangerouslySetInnerHTML={{
                __html: beforeHTML,
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 h-full py-5">
          <label
            htmlFor="after"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            After
          </label>
          <textarea
            id="after"
            readOnly
            className="border border-gray-200 dark:border-gray-800 rounded h-full font-mono p-2 text-sm bg-transparent resize-none dark:text-gray-300"
            value={afterHTML}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
