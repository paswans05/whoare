import pika, json, mysql.connector
from facenet_pytorch import InceptionResnetV1, MTCNN
import torch
from PIL import Image

# MySQL connection
db = mysql.connector.connect(
    host="localhost", user="root", password="", database="whoare"
)
cursor = db.cursor()

# Device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Models
mtcnn = MTCNN(keep_all=False, device=device)
resnet = InceptionResnetV1(pretrained="vggface2").eval().to(device)

def process_face(job):
    face_id = job["faceId"]
    path = job["path"]

    try:
        img = Image.open(path).convert("RGB")
        face = mtcnn(img)

        if face is None:
            cursor.execute("UPDATE faces SET status=%s WHERE id=%s", ("no_face", face_id))
            db.commit()
            return

        face = face.unsqueeze(0).to(device)
        embedding = resnet(face).detach().cpu().numpy().flatten().tolist()

        cursor.execute(
            "UPDATE faces SET embedding=%s, status=%s WHERE id=%s",
            (json.dumps(embedding), "processed", face_id),
        )
        db.commit()
    except Exception as e:
        print(f"[!] Error processing face {face_id}: {e}")
        cursor.execute("UPDATE faces SET status=%s WHERE id=%s", ("error", face_id))
        db.commit()

# RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
channel.queue_declare(queue="face_jobs")

def callback(ch, method, properties, body):
    job = json.loads(body)
    process_face(job)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue="face_jobs", on_message_callback=callback)
print(" [*] Waiting for face jobs...")
channel.start_consuming()
