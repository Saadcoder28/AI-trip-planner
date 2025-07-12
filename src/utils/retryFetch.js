/**
 * retryFetch — generic retry wrapper with exponential back-off.
 *
 * @param {() => Promise<any>} fn        – an async function that performs *one* request
 * @param {number} [tries=3]             – how many attempts in total
 * @param {number} [backoffMs=800]       – initial back-off delay (ms)
 * @returns {Promise<any>}               – whatever the function resolves to
 */
export async function retryFetch(fn, tries = 3, backoffMs = 800) {
    let lastErr;
  
    for (let attempt = 1; attempt <= tries; attempt++) {
      try {
        return await fn();                       // attempt succeeds ➜ return result
      } catch (err) {
        lastErr = err;
        if (attempt === tries) break;            // no more attempts left ➜ break
        // exponential back-off: delay * attempt#
        await new Promise(r => setTimeout(r, backoffMs * attempt));
      }
    }
  
    throw lastErr;                               // bubble the final error up
  }
  