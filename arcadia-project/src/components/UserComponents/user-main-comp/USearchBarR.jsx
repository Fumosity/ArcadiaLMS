import { useState, useEffect } from "react"
import { supabase } from "../../../supabaseClient"
import Trie from "../../../backend/trie"

const USearchBarR = ({ placeholder, onSearch }) => {
  const [trie, setTrie] = useState(new Trie())
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchResearch = async () => {
      const { data, error } = await supabase.from("research").select("title, keywords, author")
      if (error) {
        console.error("Error fetching research titles:", error)
      } else {
        const newTrie = new Trie()
        data.forEach((research) => {
          // Insert title
          newTrie.insert(research.title.toLowerCase())

          // Insert author if available
          if (research.author && typeof research.author === "string") {
            newTrie.insert(research.author.toLowerCase())
          }

          if (research.keywords && Array.isArray(research.keywords)) {
            research.keywords.forEach((keyword) => {
              if (keyword && typeof keyword === "string") {
                newTrie.insert(keyword.toLowerCase())
              }
            })
          }
        })
        setTrie(newTrie)
      }
    }

    fetchResearch()
  }, [])

  const handleSearch = (input) => {
    setQuery(input)
    if (input) {
      const results = trie.search(input.toLowerCase())
      console.log("Search results:", results) // Add this for debugging
      onSearch(input)
    } else {
      onSearch("")
    }
  }

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
  )
}

export default USearchBarR