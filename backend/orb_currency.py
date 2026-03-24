import cv2
import numpy as np
import os

print("🔄 Loading reference images...")

# ORB + Matcher
orb = cv2.ORB_create(nfeatures=2000)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

reference_data = {}

REF_DIR = "orb_reference"

# 📂 Load dataset
for label in os.listdir(REF_DIR):
    path = os.path.join(REF_DIR, label)

    if not os.path.isdir(path):
        continue

    descriptors_list = []

    for img_name in os.listdir(path):
        img_path = os.path.join(path, img_name)

        img = cv2.imread(img_path)

        if img is None:
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        kp, des = orb.detectAndCompute(gray, None)

        if des is not None:
            descriptors_list.append(des)

    if descriptors_list:
        reference_data[label] = descriptors_list
        print(f"✅ Loaded {label} ({len(descriptors_list)} samples)")

print("🎯 Reference loading complete")


# ---------------- SETTINGS ---------------- #

MIN_GOOD_MATCHES = 30      # stricter threshold
DISTANCE_THRESHOLD = 35    # tighter matching
CONFIDENCE_DIFF = 10       # difference between top matches


# ---------------- DETECTOR ---------------- #

def detect_currency_orb(image):

    gray_frame = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    kp2, des2 = orb.detectAndCompute(gray_frame, None)

    if des2 is None:
        return "Unable to detect currency clearly"

    match_results = []

    for label, des_list in reference_data.items():

        total_good = 0

        for des1 in des_list:

            matches = bf.match(des1, des2)

            # ✅ Strict filtering
            good_matches = [m for m in matches if m.distance < DISTANCE_THRESHOLD]

            total_good += len(good_matches)

        match_results.append((label, total_good))

        print(f"{label} → Good Matches: {total_good}")

    # 🔥 Sort matches
    match_results.sort(key=lambda x: x[1], reverse=True)

    best_label, best_score = match_results[0]
    second_score = match_results[1][1] if len(match_results) > 1 else 0

    print(f"⭐ Best: {best_label} ({best_score})")
    print(f"🔍 Second: ({second_score})")

    # 🚨 Confidence check
    if best_score < MIN_GOOD_MATCHES:
        print("❌ Low match score")
        return "Unable to detect currency clearly"

    if (best_score - second_score) < CONFIDENCE_DIFF:
        print("❌ Low confidence difference")
        return "Unable to detect currency clearly"

    # ✅ Final result
    return f"{best_label} rupees"