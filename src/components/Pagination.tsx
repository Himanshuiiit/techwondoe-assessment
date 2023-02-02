import React from 'react';
import {GrLinkNext, GrLinkPrevious} from 'react-icons/gr';

type Props = {
  usersLength: number;
  pageNo: number;
  setPageNo: (pageNo: number) => void;
};

const Pagination = ({usersLength, pageNo, setPageNo}: Props) => {
  return (
    <div className="flex flex-row justify-between px-8 py-6">
      <button
        className="w-40 rounded border border-slate-300 bg-white py-2 px-4 text-xl font-semibold text-slate-600 hover:bg-slate-300"
        onClick={() => setPageNo(pageNo - 1)}
        disabled={pageNo === 1}
      >
        <GrLinkPrevious className="relative bottom-0.5 mr-2 inline" />
        Previous
      </button>
      <div>
        {Array.from({length: Math.ceil(usersLength / 10)}, (_, i) => (
          <button
            key={i}
            className={`mx-2 h-12 w-12 rounded-lg p-4 text-lg leading-none text-slate-600 hover:bg-slate-100 ${
              i + 1 === pageNo ? 'bg-slate-300' : 'bg-white'
            }`}
            onClick={() => setPageNo(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        className="w-40 rounded border border-slate-300 bg-white py-2 px-4 text-xl font-semibold text-slate-600 hover:bg-slate-300"
        onClick={() => setPageNo(pageNo + 1)}
        disabled={pageNo === Math.ceil(usersLength / 10)}
      >
        Next
        <GrLinkNext className="relative bottom-0.5 ml-2 inline" />
      </button>
    </div>
  );
};

export default Pagination;
