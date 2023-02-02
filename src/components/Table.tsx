import React, {FC, Fragment, useRef, useState} from 'react';
import {useTable, Column, useSortBy} from 'react-table';
import {User, UserTableData} from '../types';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FiEdit2} from 'react-icons/fi';
import {BsArrowDown, BsArrowUp} from 'react-icons/bs';
import {ProgressBar} from 'loading-animations-react';
import {Dialog, Transition} from '@headlessui/react';

type Props = {
  users: User[];
  loading: boolean;
  setUsers: (users: User[]) => void;
};

const Table: FC<Props> = ({users, loading, setUsers}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDel, setIsOpenDel] = useState<boolean>(false);
  const [currName, setCurrName] = useState<string>('');
  const [currEmail, setCurrEmail] = useState<string>('');
  const [currRole, setCurrRole] = useState<string>('');
  const [currStatus, setCurrStatus] = useState<boolean>(false);
  const [currAvatar, setCurrAvatar] = useState<string>('');
  const [currId, setCurrId] = useState<number>(0);
  const [toDeleteID, setToDeleteID] = useState<number>(-1);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const imgRef = useRef<HTMLInputElement>(null);

  function closeModalDel() {
    setIsOpenDel(false);
  }

  function openModalDel() {
    setIsOpenDel(true);
  }

  function handelDelete(id) {
    const newUsers = users.filter(user => user.id !== id);
    setUsers(newUsers);
    closeModalDel();
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newUsers = users.map(user => {
      if (user.id === currId) {
        return {
          ...user,
          name: currName,
          email: currEmail,
          role: currRole,
          status: currStatus,
          avatar: currAvatar,
        };
      }
      return user;
    });
    setUsers(newUsers);
  }

  function openModal() {
    setIsOpen(true);
  }

  const usersForTable: UserTableData[] = users.map(user => {
    return {
      info: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      status: user.status ? 'Active' : 'Invited',
      lastLogin: user.lastLogin,
      role: user.role,
      methods: {
        id: user.id,
        delete: id => {
          openModalDel();
          setToDeleteID(id);
        },
        edit: id => {
          openModal();
          const currUser = users.find(user => user.id === id);
          if (currUser) {
            setCurrName(currUser.name);
            setCurrEmail(currUser.email);
            setCurrRole(currUser.role);
            setCurrStatus(currUser.status);
            setCurrAvatar(currUser.avatar || '');
            setCurrId(currUser.id);
          }
        },
      },
    };
  });

  const data = React.useMemo(() => usersForTable, [users]);

  const COLUMNS: Column<UserTableData>[] = [
    {
      Header: 'Name',
      accessor: 'info',
      Cell: allData => {
        const currCellData = allData.row.original.info;
        return (
          <>
            <div className="flex flex-row">
              <img
                src={currCellData.avatar || ''}
                alt="Profile Photo"
                className="mr-3 h-[50px] w-[50px] rounded-full drop-shadow-lg"
              />
              <div className="flex flex-col justify-center text-lg font-bold">
                <div className="font-medium">{currCellData.name}</div>
                <div className="text-sm font-medium text-gray-600">
                  {currCellData.email}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: allData => {
        const currCellData = allData.row.original;
        if (currCellData.status === 'Active') {
          return (
            <>
              <span className="flex w-[90px] items-center rounded-full bg-gray-300 py-1 px-3">
                <div className="mr-2 inline-block h-[7px]  w-[7px] rounded-full bg-gray-700" />
                Invited
              </span>
            </>
          );
        }

        return (
          <>
            <span className="flex  w-[90px] items-center rounded-full bg-green-200 py-1 px-2">
              <div className="mr-2 inline-block h-[7px]  w-[7px] rounded-full bg-green-700" />
              Active
            </span>
          </>
        );
      },
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: allData => {
        const currCellData = allData.row.original;
        return (
          <>
            <div className="font-semibold text-gray-600">
              {currCellData.role}
            </div>
          </>
        );
      },
    },
    {
      Header: 'Last Login',
      accessor: 'lastOnlineTime',
      Cell: allData => {
        const currCellData = allData.row.original;
        return (
          <div className="text-slate-700">
            <div className="text-lg font-semibold">
              {new Date(currCellData.lastLogin).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="text-sm font-semibold text-gray-500">
              {new Date(currCellData.lastLogin).toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
              })}
            </div>
          </div>
        );
      },
    },
    {
      Header: '',
      accessor: 'methods',
      Cell: allData => {
        const currCellData = allData.row.original.methods;
        return (
          <>
            <div className="flex justify-evenly">
              <RiDeleteBin6Line
                className="cursor-pointer"
                onClick={() => currCellData.delete(currCellData.id)}
              />
              <FiEdit2
                className="cursor-pointer"
                onClick={() => currCellData.edit(currCellData.id)}
              />
            </div>
          </>
        );
      },
    },
  ];

  const columns = React.useMemo(() => COLUMNS, []);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
    useTable({columns, data}, useSortBy);

  return loading ? (
    <ProgressBar
      borderColor="white"
      sliderColor="slategrey"
      sliderBackground="grey"
    />
  ) : (
    <div className="h-[630px] overflow-auto">
      <table {...getTableProps()} className="w-full bg-white">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-4 pl-4 pr-2 text-start text-gray-600"
                >
                  {column.render('Header')}
                  {column.Header !== '' && (
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BsArrowDown className="inline" />
                        ) : (
                          <BsArrowUp className="inline" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="even:bg-gray-100">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="py-4 pl-4 pr-2">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Enter new details
                  </Dialog.Title>
                  <form onSubmit={handelSubmit}>
                    <>
                      <div className="mt-2"></div>
                      <img
                        src={currAvatar}
                        alt="user"
                        className="mx-auto h-40 w-40 cursor-pointer rounded-full object-cover"
                        onClick={() => {
                          imgRef.current?.click();
                        }}
                      />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        ref={imgRef}
                        hidden
                      />
                      <span className="my-2 flex justify-center font-semibold text-slate-300">
                        Click image to change
                      </span>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="Name"
                      >
                        Name
                      </label>
                      <input
                        className="w-full justify-center rounded-md border border-slate-200 p-2"
                        id="Name"
                        onChange={e => {
                          setCurrName(e.target.value);
                        }}
                        defaultValue={currName}
                      />
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="Email"
                      >
                        Email
                      </label>
                      <input
                        className="w-full justify-center rounded-md border border-slate-200 p-2"
                        id="Email"
                        onChange={e => {
                          setCurrEmail(e.target.value);
                        }}
                        defaultValue={currEmail}
                      />

                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="Role"
                      >
                        Role
                      </label>
                      <input
                        className="w-full justify-center rounded-md border border-slate-200 p-2"
                        id="Role"
                        onChange={e => {
                          setCurrRole(e.target.value);
                        }}
                        defaultValue={currRole}
                      />
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="Status"
                      >
                        Status
                      </label>
                      <select
                        id="Status"
                        className="w-full justify-center rounded-md border border-slate-200 p-2"
                        onChange={e => {
                          setCurrStatus(
                            e.target.value === 'Active' ? true : false
                          );
                        }}
                      >
                        <option value="Active" selected={currStatus}>
                          Active
                        </option>
                        <option value="Inactive" selected={!currStatus}>
                          Inactive
                        </option>
                      </select>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isOpenDel} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalDel}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Delete
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="py-4 text-sm text-gray-500">
                      Are you sure you want to delete this user
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModalDel();
                        handelDelete(toDeleteID);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Table;
