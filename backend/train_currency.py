import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np

# ---------------- SETTINGS ---------------- #

DATASET_DIR = "dataset"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10   # ⭐ Faster + strong results

print("🔄 Loading dataset...")

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

class_names = train_ds.class_names
num_classes = len(class_names)

print("✅ Classes:", class_names)

# Save labels
np.save("labels.npy", class_names)

# ---------------- PERFORMANCE ---------------- #

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# ---------------- DATA AUGMENTATION ⭐⭐⭐⭐⭐ ---------------- #

data_augmentation = models.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2),
])

# ---------------- LOAD MOBILENET ⭐⭐⭐⭐⭐ ---------------- #

print("🧠 Loading MobileNetV2...")

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet",
)

base_model.trainable = False  # ⭐ Freeze pretrained weights

# ---------------- BUILD MODEL ---------------- #

print("🏗 Building transfer learning model...")

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),

    data_augmentation,
    layers.Rescaling(1./255),

    base_model,
    layers.GlobalAveragePooling2D(),

    layers.Dense(128, activation="relu"),
    layers.Dropout(0.5),  # ⭐ Prevent overconfidence

    layers.Dense(num_classes, activation="softmax"),
])

model.summary()

# ---------------- COMPILE ---------------- #

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

# ---------------- TRAIN ---------------- #

print("\n🚀 Training started...\n")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
)

# ---------------- SAVE ---------------- #

model.save("currency_model.h5")

print("\n🎉 MobileNet Currency Model Trained Successfully!")
print("✅ Model saved as currency_model.h5")
print("✅ Labels saved as labels.npy")