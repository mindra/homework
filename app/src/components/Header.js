import React, { useRef, useCallback, useEffect } from 'react'
import {ReactComponent as SearchIcon} from '../assets/icons/search.svg'
import {ReactComponent as MovieIcon} from '../assets/icons/movie.svg'
import { useState } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;
function Header() {
    const initBtn = useRef(null);
    const searchFieldRef = useCallback(node => {
        if (node !== null) {
          // focus search input
          node.focus();
        }
      }, []);
    const [selectedText, setText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const onStartSearching = (e) => {
        setIsSearching(true);
       
    }

    const onSearching = async (e) => {

        if (e.target.value.length > 3) {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${e.target.value}`);
            const data = await res.json();
            
            if(data && data.results && data.results.length > 0) {
                setSearchResults(data.results.splice(0, 7));
            }
        }
        else {
            setSearchResults([]);
        }
    }

    const setSelectedResult = (result) => {
        setText(result);
        setIsSearching(false);
        setSearchResults([]);        
    }

    useEffect(() => {
        initBtn.current.value = selectedText;
    }, [selectedText])

    return (
      <header className="header">
        <div className="header__search-field">
          <MovieIcon className="header__search-field__icon" />
          {!isSearching && (
          <input
          ref={initBtn}
            type="text"
            className="header__search-field__input"
            placeholder='Enter movie name'
            onClick={onStartSearching}
          />)}

          {isSearching && (
            <div className="header__expanded">
              <MovieIcon className="header__expanded__icon" />
              <div className="header__expanded__container">
                <input type="text" className="header__expanded__container__input" ref={searchFieldRef} onKeyUp={onSearching}/>
                <div className="header__expanded__container__placeholder">
                  Enter a movie name
                </div>
              </div>
              {searchResults.length > 0 && 
              <ul className="header__expanded__results">
              {searchResults.map((r, index) =>(
                <li key={index} onClick={() => setSelectedResult(r.original_title)}>
                  <div className="header__expanded__results__name">
                    {r.original_title}
                  </div>
                  <div className="header__expanded__results__rating">
                    {r.vote_average} Rating, {r.release_date}
                  </div>
                </li>
              ))}
              </ul>}
            </div>
          )}
        </div>
        {!isSearching && (
          <div className="header__search_icon">
            <SearchIcon />
          </div>
        )}
      </header>
    );
}

export default Header
