import { useDoublyLinkedList } from "./DoublyLinkedList";
import { useState } from "react";

export default function DoublyLinkedListDemo() {
  const dll = useDoublyLinkedList(["A", "B", "C", "B"]);
  const [value, setValue] = useState("");
  const [idx, setIdx] = useState("");
  const [msg, setMsg] = useState("");

  const handleInsertHead = () => {
    if (value === "") return setMsg("Enter a value to insert.");
    dll.insertHead(value);
    setValue("");
    setMsg("");
  };

  const handleInsertTail = () => {
    if (value === "") return setMsg("Enter a value to insert.");
    dll.insertTail(value);
    setValue("");
    setMsg("");
  };

  const handleRemoveIndex = () => {
    const i = Number(idx);
    if (Number.isNaN(i)) return setMsg("Index must be a number.");
    const removed = dll.removeByIndex(i);
    if (!removed) setMsg(`No node at index ${i}`);
    else setMsg(`Removed index ${i} (value: ${removed.value})`);
    setIdx("");
  };

  const handleRemoveValue = () => {
    if (value === "") return setMsg("Enter a value to remove.");
    const removed = dll.removeByValue(value);
    if (!removed) setMsg(`Value "${value}" not found`);
    else setMsg(`Removed value "${value}" (id ${removed.id})`);
    setValue("");
  };

  const handleRemoveDuplicates = () => {
    dll.removeDuplicates();
    setMsg("Removed duplicates (kept first occurrences).");
  };

  const handleSearch = () => {
    if (value === "") return setMsg("Enter value to search.");
    const idxFound = dll.indexOf(value);
    setMsg(idxFound === -1 ? `Not found` : `Found at index ${idxFound}`);
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 760 }}>
      <h2 style={{ marginTop: 0 }}>Doubly Linked List (hooks) — Requirements demo</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          placeholder="index (for removeByIndex)"
          value={idx}
          onChange={(e) => setIdx(e.target.value)}
          style={{ padding: 8, width: 160 }}
        />
        <button onClick={handleInsertHead}>Insert Head</button>
        <button onClick={handleInsertTail}>Insert Tail</button>
        <button onClick={handleRemoveValue}>Remove by Value</button>
        <button onClick={handleRemoveIndex}>Remove by Index</button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <button onClick={handleRemoveDuplicates}>Remove Duplicates</button>
        <button
          onClick={() => {
            setMsg(`Size: ${dll.size()}`);
          }}
          style={{ marginLeft: 8 }}
        >
          Size
        </button>
        <button
          onClick={() => {
            setMsg(`Forward: ${JSON.stringify(dll.toArray())}`);
          }}
          style={{ marginLeft: 8 }}
        >
          Show Forward
        </button>
        <button
          onClick={() => {
            setMsg(`Reverse: ${JSON.stringify(dll.toArrayReverse())}`);
          }}
          style={{ marginLeft: 8 }}
        >
          Show Reverse
        </button>
        <button onClick={handleSearch} style={{ marginLeft: 8 }}>
          Search (indexOf)
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Nodes (click a node to remove it):</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {dll.nodes.length === 0 ? (
            <em>list is empty</em>
          ) : (
            dll.nodes.map((n, i) => (
              <div
                key={n.id}
                onClick={() => {
                  const removed = dll.removeByIndex(i);
                  setMsg(removed ? `Removed ${removed.value}` : "Could not remove");
                }}
                title={`id: ${n.id} — prev: ${n.prev ?? "null"} — next: ${n.next ?? "null"}`}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {String(n.value)}
              </div>
            ))
          )}
        </div>
      </div>

      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}

      <hr style={{ marginTop: 16 }} />

      <div style={{ color: "#666", fontSize: 13 }}>
        API summary:
        <ul>
          <li><code>insertHead(value)</code> — insert at head</li>
          <li><code>insertTail(value)</code> — insert at tail</li>
          <li><code>removeByIndex(index)</code> — remove node at index (returns removed node or null)</li>
          <li><code>removeByValue(value)</code> — remove first occurrence (returns removed node or null)</li>
          <li><code>removeDuplicates()</code> — remove duplicate values (keep first)</li>
          <li><code>indexOf(value)</code> — returns index or -1</li>
          <li><code>size()</code> — returns length</li>
        </ul>
      </div>
    </div>
  );
}
