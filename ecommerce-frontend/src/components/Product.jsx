import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import API from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  // Read role from sessionStorage
  const authUser = JSON.parse(sessionStorage.getItem("authUser") || "{}");
  const isAdmin = authUser?.role === "ADMIN";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          const imgResponse = await API.get(`/product/${id}/image`, { responseType: "blob" });
          setImageUrl(URL.createObjectURL(imgResponse.data));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/product/${id}`);
      removeFromCart(id);
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
  }

  return (
    <div className="containers" style={{ display: "flex" }}>
      <img
        className="left-column-img"
        src={imageUrl}
        alt={product.imageName}
        style={{ width: "50%", height: "auto" }}
      />

      <div className="right-column" style={{ width: "50%" }}>
        <div className="product-description">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>
              {product.category}
            </span>
            <h6>Listed : <i>{new Date(product.releaseDate).toLocaleDateString()}</i></h6>
          </div>

          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: "capitalize", letterSpacing: "1px" }}>
            {product.name}
          </h1>
          <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
          <p style={{ fontWeight: "bold", fontSize: "1rem", margin: "10px 0px 0px" }}>PRODUCT DESCRIPTION :</p>
          <p style={{ marginBottom: "1rem" }}>{product.description}</p>
        </div>

        <div className="product-price">
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {"₹" + product.price}
          </span>
          <button
            className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
            onClick={handlAddToCart}
            disabled={!product.productAvailable}
            style={{
              padding: "1rem 2rem", fontSize: "1rem",
              backgroundColor: "#007bff", color: "white",
              border: "none", borderRadius: "5px",
              cursor: "pointer", marginBottom: "1rem",
            }}
          >
            {product.productAvailable ? "Add to cart" : "Out of Stock"}
          </button>
          <h6 style={{ marginBottom: "1rem" }}>
            Stock Available : <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
          </h6>
        </div>

        {/* Update/Delete only visible to admins */}
        {isAdmin && (
          <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/product/update/${id}`)}
              style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            >
              Update
            </button>
            <button
              className="btn btn-danger"
              onClick={deleteProduct}
              style={{ padding: "1rem 2rem", fontSize: "1rem" }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
