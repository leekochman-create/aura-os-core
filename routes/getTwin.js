router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    const { data, error } = await supabase
      .from("aitwins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.json({
        found: false,
        message: "Twin not found for this user"
      });
    }

    return res.json({
      found: true,
      twin: data
    });

  } catch (err) {
    console.error("GET_TWIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
