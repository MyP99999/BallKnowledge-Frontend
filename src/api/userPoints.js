export async function updatePoints(userId, amount) {
  try {
    const res = await fetch(`/api/user/points/increase/${userId}/${amount}`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to update points");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
