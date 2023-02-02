import React, {FC} from 'react';

const Menu: FC = () => {
  const menuItems: string[] = [
    'General',
    'Users',
    'Plan',
    'Billing',
    'Integrations',
  ];
  return (
    <ul className="flex px-4">
      {menuItems.map((item, index) => {
        return (
          <li
            className={`border px-4 py-1.5 ${
              index === 0 ? 'rounded-tl-lg rounded-bl-lg' : ''
            }
            ${
              index === menuItems.length - 1
                ? 'rounded-tr-lg rounded-br-lg'
                : ''
            }
            ${index === 1 ? 'bg-slate-100' : ''}
             `}
            key={index}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
