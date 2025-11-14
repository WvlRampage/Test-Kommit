// DoublyLinkedListDemo.jsx
import React, { useCallback, useState } from "react";

/**
 * Node shape:
 * { id: number, value: any, prev: number|null, next: number|null }
 *
 * The list is kept as an array "nodes" where order corresponds to logical order.
 * We keep prev/next ids updated so the structure is doubly-linked.
 */

let globalId = 1;
function makeNode(value) {
  return { id: globalId++, value, prev: null, next: null };
}

export function useDoublyLinkedList(initial = []) {
  const [nodes, setNodes] = useState(() => {
    // create nodes with prev/next pointers
    const created = initial.map((v) => makeNode(v));
    for (let i = 0; i < created.length; i++) {
      created[i].prev = i > 0 ? created[i - 1].id : null;
      created[i].next = i < created.length - 1 ? created[i + 1].id : null;
    }
    return created;
  });

  const size = useCallback(() => nodes.length, [nodes]);

  const rebuildLinks = (arr) => {
    // ensure prev/next pointers consistent with array order
    for (let i = 0; i < arr.length; i++) {
      arr[i].prev = i > 0 ? arr[i - 1].id : null;
      arr[i].next = i < arr.length - 1 ? arr[i + 1].id : null;
    }
  };

  const insertHead = useCallback(
    (value) => {
      setNodes((prev) => {
        const newNode = makeNode(value);
        const nextArr = [newNode, ...prev.map((n) => ({ ...n }))];
        rebuildLinks(nextArr);
        return nextArr;
      });
    },
    [setNodes]
  );

  const insertTail = useCallback(
    (value) => {
      setNodes((prev) => {
        const newNode = makeNode(value);
        const nextArr = [...prev.map((n) => ({ ...n })), newNode];
        rebuildLinks(nextArr);
        return nextArr;
      });
    },
    [setNodes]
  );

  const indexOf = useCallback(
    (value) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].value === value) return i;
      }
      return -1;
    },
    [nodes]
  );

  const removeByIndex = useCallback(
    (index) => {
      if (index < 0 || index >= nodes.length) return null;
      let removed = null;
      setNodes((prev) => {
        const nextArr = prev.map((n) => ({ ...n }));
        removed = nextArr.splice(index, 1)[0];
        rebuildLinks(nextArr);
        return nextArr;
      });
      return removed;
    },
    [nodes, setNodes]
  );

  const removeByValue = useCallback(
    (value) => {
      const idx = indexOf(value);
      if (idx === -1) return null;
      return removeByIndex(idx);
    },
    [indexOf, removeByIndex]
  );

  const removeDuplicates = useCallback(() => {
    setNodes((prev) => {
      const seen = new Set();
      const filtered = [];
      for (const node of prev) {
        if (!seen.has(node.value)) {
          seen.add(node.value);
          filtered.push({ ...node }); // copy
        }
      }
      rebuildLinks(filtered);
      return filtered;
    });
  }, [setNodes]);

  const toArray = useCallback(() => nodes.map((n) => n.value), [nodes]);
  const toArrayReverse = useCallback(
    () => nodes.slice().reverse().map((n) => n.value),
    [nodes]
  );

  // expose the API
  return {
    nodes, // full node objects (id, value, prev, next)
    insertHead,
    insertTail,
    removeByIndex,
    removeByValue,
    removeDuplicates,
    indexOf,
    size,
    toArray,
    toArrayReverse,
  };
}