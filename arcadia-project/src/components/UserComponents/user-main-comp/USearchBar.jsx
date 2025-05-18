import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"
import Trie from "../../../backend/trie"

const USearchBar = ({ placeholder, structureType, onSearch }) => {
  const [trie, setTrie] = useState(new Trie())
  const [suggestions, setSuggestions] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("book_titles").select("title, keywords")
      if (error) {
        console.error("Error fetching books:", error)
      } else {
        const newTrie = new Trie()
        data.forEach((book) => {
          // Add title to trie
          newTrie.insert(book.title.toLowerCase())

          // Add keywords to trie
          if (book.keywords && Array.isArray(book.keywords)) {
            book.keywords.forEach((keyword) => {
              newTrie.insert(keyword.toLowerCase())
            })
          }
        })
        setTrie(newTrie)
      }
    }

    fetchBooks()
  }, [])

  const handleSearch = (input) => {
    setQuery(input)
    if (input) {
      const results = trie.search(input.toLowerCase())
      setSuggestions(results)
      onSearch(input) // Send query to parent component
    } else {
      setSuggestions([])
      onSearch("") // Notify parent to clear the query
    }
  }

  return (
    <section className="userSearch-section">
      <h2 className="userSearch-title">What book are you looking for?</h2>
      <input
        type="text"
        className="userSearch-input"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </section>
  )
}

export default USearchBar
