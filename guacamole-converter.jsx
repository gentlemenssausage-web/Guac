import React, { useState, useRef } from 'react';

export default function GuacamoleConverter() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const recipeTemplates = [
    {
      steps: ["Locate the {ingredient} in your {location}", "Apply generous amounts of lime", "Mash vigorously with {tool}", "Add salt to taste and regret"],
      ingredients: ["avocado extract", "guacamole essence", "essence of green", "liquified produce"],
      locations: ["image", "canvas", "digital realm", "screen"],
      tools: ["mouse cursor", "keyboard", "enthusiasm", "desperation"],
    }
  ];

  const generateRecipe = (imageName) => {
    const template = recipeTemplates[0];
    const ing = template.ingredients[Math.floor(Math.random() * template.ingredients.length)];
    const loc = template.locations[Math.floor(Math.random() * template.locations.length)];
    const tool = template.tools[Math.floor(Math.random() * template.tools.length)];

    return {
      title: `${imageName} Guacamole`,
      servings: Math.floor(Math.random() * 8) + 1,
      steps: [
        `Locate the ${ing} in your ${loc}`,
        `Apply generous amounts of lime juice to make it look more guacamole-ish`,
        `Mash vigorously with your ${tool}`,
        `Add salt to taste and contemplate your life choices`,
        `Serve immediately to confused dinner guests`
      ],
      notes: "This recipe may not be edible. The ${imageName} was not harmed in the making of this guacamole."
    };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Store original
        setOriginalImage(img);

        // Process on canvas
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original
        ctx.drawImage(img, 0, 0);

        // Apply guacamole effects
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Shift toward green, add noise
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Boost green channel, reduce others
          const newR = Math.max(0, r * 0.6 + (g * 0.2));
          const newG = Math.min(255, g * 1.3 + (r * 0.1) + (b * 0.1));
          const newB = Math.max(0, b * 0.5 + (r * 0.1));

          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
        }

        // Add texture
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 30;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.5));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedImage(canvas.toDataURL());

        // Generate recipe
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setRecipe(generateRecipe(fileName));

        setLoading(false);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🥑 Guacamole Converter</h1>
        <p style={styles.subtitle}>Transform any image into a guacamole recipe</p>
      </div>

      <div style={styles.uploadSection}>
        <label style={styles.uploadLabel}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.input}
          />
          <span style={styles.uploadButton}>
            {loading ? 'Processing...' : 'Choose Image'}
          </span>
        </label>
      </div>

      {processedImage && (
        <div style={styles.resultSection}>
          <div style={styles.imageGrid}>
            <div style={styles.imageBox}>
              <p style={styles.label}>Original</p>
              {originalImage && (
                <img 
                  src={originalImage.src} 
                  style={styles.image}
                  alt="Original"
                />
              )}
            </div>
            <div style={styles.imageBox}>
              <p style={styles.label}>Guacamole'd</p>
              <img 
                src={processedImage} 
                style={styles.image}
                alt="Processed"
              />
            </div>
          </div>

          {recipe && (
            <div style={styles.recipeBox}>
              <h2 style={styles.recipeTitle}>{recipe.title}</h2>
              <p style={styles.recipeDetail}>Servings: {recipe.servings} portions of pure chaos</p>
              
              <h3 style={styles.stepTitle}>Instructions:</h3>
              <ol style={styles.stepsList}>
                {recipe.steps.map((step, idx) => (
                  <li key={idx} style={styles.step}>{step}</li>
                ))}
              </ol>

              <p style={styles.note}>⚠️ {recipe.notes}</p>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
    padding: '40px 20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    margin: '0 0 10px 0',
    color: '#2d5016',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '18px',
    color: '#558b2f',
    margin: 0,
  },
  uploadSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  uploadLabel: {
    cursor: 'pointer',
  },
  input: {
    display: 'none',
  },
  uploadButton: {
    display: 'inline-block',
    padding: '16px 32px',
    background: '#558b2f',
    color: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s',
    border: 'none',
    ':hover': {
      background: '#33691e',
    },
  },
  resultSection: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '40px',
  },
  imageBox: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  label: {
    padding: '12px',
    margin: 0,
    background: '#f5f5f5',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#558b2f',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxHeight: '400px',
    objectFit: 'contain',
  },
  recipeBox: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  recipeTitle: {
    fontSize: '28px',
    color: '#2d5016',
    margin: '0 0 10px 0',
  },
  recipeDetail: {
    color: '#666',
    margin: '0 0 20px 0',
    fontStyle: 'italic',
  },
  stepTitle: {
    fontSize: '18px',
    color: '#558b2f',
    marginTop: '20px',
    marginBottom: '10px',
  },
  stepsList: {
    color: '#333',
    lineHeight: '1.8',
    paddingLeft: '20px',
  },
  step: {
    marginBottom: '10px',
  },
  note: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    color: '#888',
    fontSize: '14px',
  },
};
