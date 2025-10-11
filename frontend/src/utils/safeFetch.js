export const safeFetch = async (url, options = {}) => {
    try {
        const res = await fetch(url, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
};
