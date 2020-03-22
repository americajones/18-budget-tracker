const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", {autoIncrement: true});

};

request.onsuccess = function(event) {
  db = target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log(error)
}; 

function saveRecord(record) {
  const db = request.result;
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingStore = transaction.objectStore("pending");
  
  pendingStore.add(record)
}

function checkDatabase() {
  const db = request.result;
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingStore = transaction.objectStore("pending");
  const getAll  = pendingStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.clear();
      });
    }
  };
}

window.addEventListener("online", checkDatabase);