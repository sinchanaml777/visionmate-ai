import cv2
def capture_image():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Camera not accessible")
        return None

    while True:
        ret, frame = cap.read()
        cv2.imshow("Vision Mate Camera", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("c"):  # Capture
            image = frame
            break

        elif key == ord("q"):  # Quit camera
            image = None
            break

    cap.release()
    cv2.destroyAllWindows()
    return image