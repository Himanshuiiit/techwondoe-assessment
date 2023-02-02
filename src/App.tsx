import React, {FC, useState} from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Table from './components/Table';
import {User} from './types';
import Pagination from './components/Pagination';
import {useQuery} from 'react-query';

const App: FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);

  const {isLoading} = useQuery('repoData', () =>
    fetch('https://63d8edcf74f386d4efe0de4b.mockapi.io/api/users/users')
      .then(res => res.json())
      .then(data => setUserData(data))
  );

  return (
    <div className="App">
      <div className="py-8 px-4 text-5xl font-semibold">Company Settings</div>
      <Menu />
      <div className="m-4 rounded-lg border">
        <Header users={userData} setUsers={setUserData} />
        <Table
          users={userData.slice(10 * (pageNo - 1), 10 * pageNo)}
          setUsers={setUserData}
          loading={isLoading}
        />
        <Pagination
          usersLength={userData.length}
          pageNo={pageNo}
          setPageNo={setPageNo}
        />
      </div>
    </div>
  );
};

export default App;
