export const safeFetch = async (url, options = {}) => {
    try {
        const res = await fetch(url, {
            credentials: "include",
            headers: options.method && options.method !== 'GET' ? { "Content-Type": "application/json" } : {},
            ...options,
        });

        const data = await res.json();
        if (!res.ok) {
            return { error: data.error || data.message || "Request failed" };
        }
        return data;
    } catch (err) {
        console.error("Fetch error:", err);
        return { error: "Network error. Please try again." };
    }
};
