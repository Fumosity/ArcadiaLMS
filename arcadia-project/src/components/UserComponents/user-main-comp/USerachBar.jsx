import React from "react"

const UsearchBar = () => {
    return(

    <section className="userSearch-section">
        <h2 className="userSearch-title">What are you looking for?</h2>
        <input type="text" className="userSearch-input" placeholder="Search for books, authors, or topics..." />

        <div className="userSearch-suggestions">
            <p>Try:</p>
            <div className="userSuggestion-buttons">
                <button className="userSuggestion-button">Option 1</button>
                <button className="userSuggestion-button">Option 2</button>
                <button className="userSuggestion-button">Option 3</button>
                <button className="userSuggestion-button">Option 4</button>
            </div>
        </div>
    </section>
    )
}
export default UsearchBar;