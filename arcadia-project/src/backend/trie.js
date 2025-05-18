export class TrieNode {
    constructor() {
      this.children = {}
      this.isEndOfWord = false
      this.items = [] // Store references to research items
    }
  }
  
  export default class Trie {
    constructor() {
      this.root = new TrieNode()
    }
  
    insert(word, item) {
      let node = this.root
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode()
        }
        node = node.children[char]
      }
      node.isEndOfWord = true
  
      // Store the item reference at the end of the word
      if (item && !node.items.some((existingItem) => existingItem.id === item.id)) {
        node.items.push(item)
      }
    }
  
    search(prefix) {
      let node = this.root
      for (const char of prefix) {
        if (!node.children[char]) return []
        node = node.children[char]
      }
      return this.collectItems(node, prefix)
    }
  
    collectItems(node, prefix) {
      // Get unique items from this node and all its children
      const items = [...node.items]
  
      for (const char in node.children) {
        const childItems = this.collectItems(node.children[char], prefix + char)
        // Merge items, avoiding duplicates
        childItems.forEach((item) => {
          if (!items.some((existingItem) => existingItem.id === item.id)) {
            items.push(item)
          }
        })
      }
  
      return items
    }
  }
  