"use client";

export default function Navbar() {
  return (
    <div>
      <nav
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.1rem",
            letterSpacing: "0.26em",
            color: "#fff",
          }}
        >
          SANAT JHA
        </span>

        <ul
          style={{
            display: "flex",
            gap: "3rem",
            listStyle: "none",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {["About", "Skills", "Works", "Education", "Contact"].map((n) => (
            <li
              key={n}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
              }
            >
              {n}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
