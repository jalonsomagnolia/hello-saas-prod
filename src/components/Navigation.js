import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAPIBase, getLanguages, getCurrentLanguage, changeLanguage } from '../helpers/AppHelpers';

function renderLanguages() {
  const currentLanguage = getCurrentLanguage();

  return (
    <div className="languages">
      {getLanguages().map((lang) => (
        <span key={`lang-${lang}`} data-active={currentLanguage === lang} onClick={() => changeLanguage(lang)}>
          {lang}
        </span>
      ))}
    </div>
  );
}

function Navigation() {
  const [navItems, setNavItems] = React.useState([]);

  React.useEffect(() => {
    async function fetchNav() {
      const apiBase = getAPIBase();

      const url = apiBase + process.env.REACT_APP_MGNL_API_NAV + process.env.REACT_APP_MGNL_APP_BASE;

      const response = await fetch(url + `?access_token=${process.env.REACT_APP_MGNL_SUB_ID}`);
      const data = await response.json();
      let items = data['@nodes'].map((nodeName) => {
        return data[nodeName];
      });
      setNavItems([data, ...items]);
    }

    if (navItems.length < 1) {
      fetchNav();
    }
  }, [navItems]);

  return navItems ? (
    <nav className="Navigation">
      {navItems.map((item) => {
        return (
          <NavLink
            activeClassName="active"
            key={item['@id']}
            to={item['@path'].replace(process.env.REACT_APP_MGNL_APP_BASE, '')}
          >
            {item.navigationTitle || item.title || item['@name']}
          </NavLink>
        );
      })}
      {renderLanguages()}
    </nav>
  ) : (
    <div />
  );
}

export default Navigation;
