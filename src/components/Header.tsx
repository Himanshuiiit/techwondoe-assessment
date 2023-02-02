import React, {FC, Fragment, useRef, useState} from 'react';
import {IoAddOutline} from 'react-icons/io5';
import {FiDownloadCloud} from 'react-icons/fi';
import {User} from '../types';
import {Dialog, Transition} from '@headlessui/react';
type Props = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const Header: FC<Props> = ({users, setUsers}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currName, setCurrName] = useState<string>('');
  const [currEmail, setCurrEmail] = useState<string>('');
  const [currRole, setCurrRole] = useState<string>('');
  const [currStatus, setCurrStatus] = useState<boolean>(false);
  const [currAvatar, setCurrAvatar] = useState<string>(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  );
  const [currId, setCurrId] = useState<number>(0);
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

  function closeModal() {
    setIsOpen(false);
  }

  function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newUsers = [
      ...users,
      {
        name: currName,
        email: currEmail,
        role: currRole,
        status: currStatus,
        avatar: currAvatar,
        id: currId,
        lastLogin: new Date(),
      },
    ];
    setUsers(newUsers);
    setCurrName('');
    setCurrEmail('');
    setCurrRole('');
    setCurrStatus(false);
    closeModal();
  }

  function openModal() {
    setCurrId(users.length + 1);
    setIsOpen(true);
  }

  const download = () => {
    const items = users;

    const replacer = (_key: unknown, value: null) =>
      value === null ? '' : value;
    const header = ['id', 'name', 'email', 'role', 'status', 'last Login'];
    const csv = [
      header.join(','),
      ...items.map(row =>
        header
          .map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(',')
      ),
    ].join('\r\n');
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csv));

    link.setAttribute('download', 'User Data');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div>
        <div className="flex flex-row justify-between border-b-[2px] py-8 px-4">
          <div>
            <div className="pb-2">
              <span className="text-3xl font-semibold">User</span>{' '}
              <span className="relative bottom-0.5 mx-1 w-[90px] items-center rounded-full bg-green-200 py-0.5 px-2.5">
                {users.length} users
              </span>
            </div>
            <div className="font-medium text-slate-500">
              Manage your team members and their account permissions here.
            </div>
          </div>
          <div>
            <button
              className="mx-3 rounded-lg border-2 border-slate-300 py-4 px-8 text-lg font-medium hover:bg-slate-300"
              onClick={download}
            >
              <FiDownloadCloud className="relative bottom-0.5 mr-2 inline-block text-2xl" />
              Download CSV
            </button>
            <button
              className="mx-3 rounded-lg bg-blue-600 py-4 px-8 text-lg font-medium text-white hover:bg-blue-700"
              onClick={openModal}
            >
              <IoAddOutline className="relative bottom-0.5 mr-2 inline-block text-2xl" />
              Add user
            </button>
          </div>
        </div>
      </div>
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
                    Enter details
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
                      <span className="my-2 flex justify-center font-semibold text-slate-300">
                        Click image to change
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        ref={imgRef}
                        hidden
                      />
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
                          onClick={() => {
                            closeModal;
                          }}
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
    </>
  );
};

export default Header;
