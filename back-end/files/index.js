module.exports = async function(waw) {
	const router = waw.router("/api/files/file")
	bucket.file(imagePath);
	const file = bucket.file(imagePath);
	router.post("/file", (req, res) => {
		req.file
	});
	file.save();
};