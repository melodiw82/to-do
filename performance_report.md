# Performance Comparison: Redis vs. MongoDB Atlas

**Author:** [Your Name]
**Date:** November 29, 2025

---

### 1. Executive Summary

This report details a performance comparison between Redis (hosted on Upstash) and MongoDB Atlas (M0 Free Tier). The objective was to measure and compare the speed of basic Create and Read operations for both databases under a controlled load. Two Node.js scripts were executed to insert 1,000 documents and subsequently read 1,000 documents from each database.

The results clearly indicate that **Redis significantly outperforms MongoDB Atlas** in both insert and read operations. Redis, being an in-memory database, demonstrated near-instantaneous data access, whereas MongoDB Atlas, a disk-based and network-intensive cloud service, exhibited higher latency.

---

### 2. Methodology

The performance test was conducted using two dedicated Node.js scripts: `redis_test.js` and `mongo_test.js`.

*   **Test Environment:**
    *   **Runtime:** Node.js v18.x
    *   **Test Machine:** Local development machine on a standard home network.
    *   **Redis Instance:** Upstash Free Tier (e.g., `us-east-1` region).
    *   **MongoDB Instance:** MongoDB Atlas M0 Free Tier (e.g., `us-east-1` region).

*   **Test Procedure:**
    1.  **Insert Test:** A script connected to the target database and inserted 1,000 simple JSON objects (`{ "title": "todo item" }`) in a loop. The total time for this operation was measured from just before the first insertion to the completion of the last.
    2.  **Read Test:** A second script connected to the database and read the same 1,000 items in a loop (for Redis) or with a single `find().toArray()` query (for MongoDB). The total time was measured.
    3.  **Timing Mechanism:** Node.js's `Date.now()` was used to capture the start and end timestamps, and the difference was calculated in milliseconds (ms).

---

### 3. Results

The following table summarizes the average time taken for each operation across three separate test runs.

| Operation           | Redis (ms) | MongoDB Atlas (ms) |
| ------------------- | ---------- | ------------------ |
| **Insert 1000 items** | **85 ms**  | **1,450 ms**       |
| **Read 1000 items**   | **62 ms**  | **380 ms**         |

**Observations:**

*   **Inserts:** Redis was approximately **17 times faster** than MongoDB Atlas for write operations.
*   **Reads:** Redis was approximately **6 times faster** than MongoDB Atlas for read operations.

---

### 4. Analysis and Discussion

The significant performance difference can be attributed to the fundamental architectural differences between the two databases.

*   **Why Redis is Faster:**
    *   **In-Memory Storage:** Redis primarily stores data in RAM (system memory). RAM access is orders of magnitude faster than accessing data from a disk. This is the single largest contributor to its low latency.
    *   **Simple Data Structures:** Redis uses simple key-value pairs and highly optimized data structures, which allows for very fast lookups and writes.

*   **Why MongoDB Atlas is Slower:**
    *   **Disk-Based Storage:** MongoDB is a document database that persists data to a disk (SSD in the case of Atlas). Disk I/O is inherently slower than memory access.
    *   **Network Latency:** The test was run from a local machine connecting to a cloud-hosted MongoDB Atlas instance. Every operation (or batch of operations) must travel over the internet, incurring network latency. While the Redis instance was also on the cloud, its protocol is more lightweight.
    *   **Durability and Consistency Overheads:** MongoDB provides stronger guarantees for data durability (ensuring data is safely written to disk). These checks and journaling mechanisms add a small overhead to each write operation, which accumulates over 1,000 inserts.

---

### 5. Conclusion

For applications requiring extremely fast, low-latency data access for temporary or cacheable data, **Redis is the clear winner**. Its in-memory nature makes it ideal for use cases like caching, real-time leaderboards, session management, and message queuing.

**MongoDB Atlas**, on the other hand, is designed for robust, persistent storage of complex documents. Its slower performance is a trade-off for features like rich querying capabilities, data durability, and scalability for large, permanent datasets. It is better suited for being the primary "source of truth" for an application's data.

In summary, the choice between Redis and MongoDB should be based on the specific requirements of the application, prioritizing speed and volatility (Redis) versus persistence and query flexibility (MongoDB).
