import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import Trie from "../../../backend/trie";

const USearchBarR = ({ placeholder, onSearch }) => {
    const [trie, setTrie] = useState(new Trie());
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchResearch = async () => {
            const { data, error } = await supabase.from("research").select("title");
            if (error) {
                console.error("Error fetching research titles:", error);
            } else {
                const newTrie = new Trie();
                data.forEach((research) => newTrie.insert(research.title.toLowerCase()));
                setTrie(newTrie);
            }
        };

        fetchResearch();
    }, []);

    const handleSearch = (input) => {
        setQuery(input);
        if (input) {
            const results = trie.search(input.toLowerCase());
            onSearch(input);
        } else {
            onSearch("");
        }
    };

    return (
        <section className="userSearch-section">
            <h2 className="userSearch-title">What research are you looking for?</h2>
            <input
                type="text"
                className="userSearch-input"
                placeholder={placeholder || "Search for research..."}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </section>
    );
};

export default USearchBarR;
