import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import Depends, File, FastAPI, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin"
ADMIN_TOKEN = "demo-admin-token"


class Car(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    make: str
    model: str
    year: int
    price: float
    mileage: int
    fuel_type: str
    transmission: str
    body_type: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_sold: bool = False
    main_image: str
    gallery: List[str] = Field(default_factory=list)
    description: str
    color: Optional[str] = None
    power_hp: Optional[int] = None
    video_url: Optional[str] = None
    extras: List[str] = Field(default_factory=list)


class CarCreate(BaseModel):
    title: str
    make: str
    model: str
    year: int
    price: float
    mileage: int
    fuel_type: str
    transmission: str
    body_type: str
    category: str
    main_image: str
    gallery: List[str] = Field(default_factory=list)
    description: str
    color: Optional[str] = None
    power_hp: Optional[int] = None
    video_url: Optional[str] = None
    extras: List[str] = Field(default_factory=list)


class CarUpdate(BaseModel):
    title: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    body_type: Optional[str] = None
    category: Optional[str] = None
    main_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    description: Optional[str] = None
    is_sold: Optional[bool] = None
    color: Optional[str] = None
    power_hp: Optional[int] = None
    video_url: Optional[str] = None
    extras: Optional[List[str]] = None


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    car_id: Optional[str] = None
    type: Optional[str] = "contact"


class TestDriveBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    car_id: str
    name: str
    email: str
    phone: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"


class TestDriveCreate(BaseModel):
    car_id: str
    name: str
    email: str
    phone: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None


class NotifySubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    email: str
    make: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotifyCreate(BaseModel):
    email: str
    make: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class CallbackRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    phone: str
    preferred_time: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"


class CallbackCreate(BaseModel):
    name: str
    phone: str
    preferred_time: Optional[str] = None
    message: Optional[str] = None


class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    visitor_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: datetime = Field(default_factory=datetime.utcnow)


class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str
    text: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChatMessageCreate(BaseModel):
    text: str
    is_admin: bool = False


class ContactMessage(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    email: str


app = FastAPI(title="Demo Car Dealer API", version="1.0.0")

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    if credentials.scheme.lower() != "bearer" or credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin token")
    return ADMIN_EMAIL


cars_db: List[Car] = []
messages_db: List[ContactMessage] = []
test_drives_db: List[TestDriveBooking] = []
notify_subscriptions_db: List[NotifySubscription] = []
callback_requests_db: List[CallbackRequest] = []
chat_sessions_db: List[ChatSession] = []
chat_messages_db: List[ChatMessage] = []


def seed_demo_cars() -> None:
    if cars_db:
        return

    demo_cars = [
        Car(
            title="Tesla Model 3 Performance",
            make="Tesla",
            model="Model 3",
            year=2023,
            price=25990000,
            mileage=12000,
            fuel_type="Elektromos",
            transmission="Automata",
            body_type="Sedan",
            category="Prémium",
            main_image="https://images.pexels.com/photos/10029878/pexels-photo-10029878.jpeg",
            gallery=[
                "https://images.pexels.com/photos/10029878/pexels-photo-10029878.jpeg",
                "https://images.pexels.com/photos/10029880/pexels-photo-10029880.jpeg",
                "https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg",
            ],
            description="Full self-driving csomaggal, fehér bőr belsővel, garanciás akkumulátorral.",
            color="Fehér",
            power_hp=450,
            extras=["Full Self-Driving", "Bőr belső", "Panoráma tető", "Klimatizált", "Vezetőasszisztens"],
        ),
        Car(
            title="BMW 3-as Touring M Sport",
            make="BMW",
            model="320d Touring",
            year=2021,
            price=12990000,
            mileage=48000,
            fuel_type="Dízel",
            transmission="Automata",
            body_type="Kombi",
            category="Családi",
            main_image="https://images.pexels.com/photos/33812131/pexels-photo-33812131.jpeg",
            gallery=[
                "https://images.pexels.com/photos/33812131/pexels-photo-33812131.jpeg",
                "https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg",
                "https://images.pexels.com/photos/2127014/pexels-photo-2127014.jpeg",
            ],
            description="Magas felszereltség, digitális műszerfal, LED fényszórók, magyarországi első forgalomba helyezés.",
            color="Kék",
            power_hp=190,
            extras=["Digitális műszerfal", "LED fényszórók", "Klimatizált", "Bőr belső", "GPS navigáció", "Parkolóradar"],
        ),
        Car(
            title="Audi Q5 Quattro S-line",
            make="Audi",
            model="Q5",
            year=2020,
            price=15490000,
            mileage=62000,
            fuel_type="Benzin",
            transmission="Automata",
            body_type="SUV",
            category="SUV",
            main_image="https://images.pexels.com/photos/14666502/pexels-photo-14666502.jpeg",
            gallery=[
                "https://images.pexels.com/photos/14666502/pexels-photo-14666502.jpeg",
                "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg",
            ],
            description="Quattro összkerékhajtás, S-line csomag, szervizkönyv, frissen szervizelt.",
            color="Piros",
            power_hp=249,
            extras=["Quattro összkerék", "S-line csomag", "Klimatizált", "Bőr belső", "Kamera", "Hátsó parkolóradar"],
        ),
        Car(
            title="Volkswagen Golf 8 GTI",
            make="Volkswagen",
            model="Golf GTI",
            year=2022,
            price=8990000,
            mileage=22000,
            fuel_type="Benzin",
            transmission="Automata",
            body_type="Sedan",
            category="Családi",
            main_image="https://images.pexels.com/photos/32447516/pexels-photo-32447516.jpeg",
            gallery=[
                "https://images.pexels.com/photos/32447516/pexels-photo-32447516.jpeg",
                "https://images.pexels.com/photos/15646695/pexels-photo-15646695.jpeg",
                "https://images.pexels.com/photos/32447521/pexels-photo-32447521.jpeg",
            ],
            description="Sportos felszereltség, digitális műszerfal, 245 LE, szervizkönyv.",
            color="Fekete",
            power_hp=245,
            extras=["Digitális műszerfal", "Sport ülés", "Klimatizált", "LED fényszórók", "Hátsó parkolóradar"],
        ),
        Car(
            title="Mercedes-Benz E 220d AMG Line",
            make="Mercedes-Benz",
            model="E 220d",
            year=2021,
            price=18990000,
            mileage=35000,
            fuel_type="Dízel",
            transmission="Automata",
            body_type="Sedan",
            category="Prémium",
            main_image="https://images.pexels.com/photos/12152812/pexels-photo-12152812.jpeg",
            gallery=[
                "https://images.pexels.com/photos/12152812/pexels-photo-12152812.jpeg",
                "https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg",
                "https://images.pexels.com/photos/18369294/pexels-photo-18369294.jpeg",
            ],
            description="AMG Line külső, bőr belső, Burmester hangrendszer, magyarországi első tulajdonos.",
            color="Ezüst",
            power_hp=194,
            extras=["AMG Line", "Bőr belső", "Burmester hangrendszer", "Klimatizált", "Kamera", "Memória ülés"],
        ),
        Car(
            title="Toyota RAV4 Hybrid",
            make="Toyota",
            model="RAV4",
            year=2023,
            price=12490000,
            mileage=15000,
            fuel_type="Hibrid",
            transmission="Automata",
            body_type="SUV",
            category="SUV",
            main_image="https://images.pexels.com/photos/10902922/pexels-photo-10902922.jpeg",
            gallery=[
                "https://images.pexels.com/photos/10902922/pexels-photo-10902922.jpeg",
                "https://images.pexels.com/photos/10604483/pexels-photo-10604483.jpeg",
                "https://images.pexels.com/photos/27497634/pexels-photo-27497634.jpeg",
            ],
            description="Hibrid hajtás, alacsony fogyasztás, garanciális, teljes felszereltség.",
            color="Fehér",
            power_hp=218,
            extras=["Hibrid hajtás", "Klimatizált", "Kamera", "Vezetőasszisztens", "Környezetbarát"],
        ),
        Car(
            title="Skoda Octavia Combi Style",
            make="Skoda",
            model="Octavia Combi",
            year=2020,
            price=6490000,
            mileage=72000,
            fuel_type="Dízel",
            transmission="Automata",
            body_type="Kombi",
            category="Családi",
            main_image="https://images.pexels.com/photos/31723207/pexels-photo-31723207.jpeg",
            gallery=[
                "https://images.pexels.com/photos/31723207/pexels-photo-31723207.jpeg",
                "https://images.pexels.com/photos/27972289/pexels-photo-27972289.jpeg",
                "https://images.pexels.com/photos/30271164/pexels-photo-30271164.jpeg",
            ],
            description="Tágas csomagtér, klimatizált, szervizkönyv, megbízható dízel motor.",
            color="Szürke",
            power_hp=150,
            extras=["Klimatizált", "Tágas csomagtér", "Központi zár", "Rádió", "Hátsó parkolóradar"],
        ),
        Car(
            title="Ford Mustang GT",
            make="Ford",
            model="Mustang GT",
            year=2019,
            price=16990000,
            mileage=28000,
            fuel_type="Benzin",
            transmission="Automata",
            body_type="Coupe",
            category="Prémium",
            main_image="https://images.pexels.com/photos/29028971/pexels-photo-29028971.jpeg",
            gallery=[
                "https://images.pexels.com/photos/29028971/pexels-photo-29028971.jpeg",
                "https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg",
            ],
            description="5.0 V8 motor, 450 LE, sport kipufogó, egyedi szín, gyűjtői állapot.",
            color="Kék",
            power_hp=450,
            extras=["V8 motor", "Sport kipufogó", "Bőr belső", "Klimatizált", "LED fényszórók"],
        ),
    ]
    cars_db.extend(demo_cars)


seed_demo_cars()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/cars/makes", response_model=List[str])
def list_makes() -> List[str]:
    makes = sorted({c.make for c in cars_db})
    return makes


@app.get("/api/cars", response_model=List[Car])
def list_cars(
    make: Optional[str] = Query(default=None, description="Márka szűrés"),
    search: Optional[str] = Query(default=None, description="Szabad szavas keresés"),
    category: Optional[str] = Query(default=None),
    color: Optional[str] = Query(default=None),
    min_price: Optional[float] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
    min_power: Optional[int] = Query(default=None, description="Min teljesítmény LE"),
    max_power: Optional[int] = Query(default=None, description="Max teljesítmény LE"),
    sort: Optional[str] = Query(
        default=None,
        description="Rendezés: price_asc, price_desc, date_asc, date_desc",
    ),
) -> List[Car]:
    results = list(cars_db)

    if make:
        results = [c for c in results if c.make.lower() == make.lower()]

    if search:
        lowered = search.lower()
        results = [
            c
            for c in results
            if lowered in c.title.lower()
            or lowered in c.make.lower()
            or lowered in c.model.lower()
            or lowered in c.description.lower()
        ]

    if category:
        results = [c for c in results if c.category.lower() == category.lower()]

    if color:
        results = [c for c in results if c.color and c.color.lower() == color.lower()]

    if min_power is not None:
        results = [c for c in results if c.power_hp is not None and c.power_hp >= min_power]

    if max_power is not None:
        results = [c for c in results if c.power_hp is not None and c.power_hp <= max_power]

    if min_price is not None:
        results = [c for c in results if c.price >= min_price]

    if max_price is not None:
        results = [c for c in results if c.price <= max_price]

    if sort == "price_asc":
        results.sort(key=lambda c: c.price)
    elif sort == "price_desc":
        results.sort(key=lambda c: c.price, reverse=True)
    elif sort == "date_asc":
        results.sort(key=lambda c: c.created_at)
    elif sort == "date_desc":
        results.sort(key=lambda c: c.created_at, reverse=True)

    return results


@app.get("/api/cars/{car_id}", response_model=Car)
def get_car(car_id: str) -> Car:
    for car in cars_db:
        if car.id == car_id:
            return car
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")


@app.post("/api/contact", response_model=ContactMessage, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate) -> ContactMessage:
    data = payload.model_dump()
    message = ContactMessage(**data)
    messages_db.append(message)
    return message


@app.post("/api/test-drive", response_model=TestDriveBooking, status_code=status.HTTP_201_CREATED)
def create_test_drive(payload: TestDriveCreate) -> TestDriveBooking:
    booking = TestDriveBooking(**payload.model_dump())
    test_drives_db.append(booking)
    return booking


@app.post("/api/notify", response_model=NotifySubscription, status_code=status.HTTP_201_CREATED)
def create_notify_subscription(payload: NotifyCreate) -> NotifySubscription:
    sub = NotifySubscription(**payload.model_dump())
    notify_subscriptions_db.append(sub)
    return sub


@app.post("/api/callback", response_model=CallbackRequest, status_code=status.HTTP_201_CREATED)
def create_callback_request(payload: CallbackCreate) -> CallbackRequest:
    req = CallbackRequest(**payload.model_dump())
    callback_requests_db.append(req)
    return req


def get_or_create_chat_session(session_id: Optional[str] = None) -> ChatSession:
    if session_id:
        for s in chat_sessions_db:
            if s.id == session_id:
                return s
    session = ChatSession()
    chat_sessions_db.append(session)
    return session


@app.post("/api/chat/session", response_model=ChatSession)
def create_chat_session() -> ChatSession:
    return get_or_create_chat_session()


@app.get("/api/chat/session/{session_id}", response_model=ChatSession)
def get_chat_session(session_id: str) -> ChatSession:
    for s in chat_sessions_db:
        if s.id == session_id:
            return s
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")


@app.get("/api/chat/{session_id}/messages", response_model=List[ChatMessage])
def get_chat_messages(session_id: str) -> List[ChatMessage]:
    msgs = [m for m in chat_messages_db if m.session_id == session_id]
    return sorted(msgs, key=lambda x: x.created_at)


@app.post("/api/chat/{session_id}/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED)
def send_chat_message(session_id: str, payload: ChatMessageCreate) -> ChatMessage:
    session = None
    for s in chat_sessions_db:
        if s.id == session_id:
            session = s
            break
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    msg = ChatMessage(session_id=session_id, text=payload.text, is_admin=payload.is_admin)
    chat_messages_db.append(msg)
    for i, s in enumerate(chat_sessions_db):
        if s.id == session_id:
            chat_sessions_db[i] = ChatSession(
                id=s.id, visitor_name=s.visitor_name, created_at=s.created_at, last_message_at=datetime.utcnow()
            )
            break
    return msg


@app.post("/api/admin/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest) -> AdminLoginResponse:
    if payload.email != ADMIN_EMAIL or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return AdminLoginResponse(token=ADMIN_TOKEN, email=ADMIN_EMAIL)


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")


@app.post("/api/admin/upload", response_model=List[str])
async def admin_upload_images(
    _: str = Depends(get_current_admin),
    files: List[UploadFile] = File(default=[]),
) -> List[str]:
    if not files:
        return []
    urls: List[str] = []
    for f in files:
        ext = Path(f.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue
        name = f"{uuid4()}{ext}"
        path = UPLOAD_DIR / name
        content = await f.read()
        path.write_bytes(content)
        urls.append(f"{BASE_URL}/uploads/{name}")
    return urls


@app.get("/api/admin/cars", response_model=List[Car])
def admin_list_cars(_: str = Depends(get_current_admin)) -> List[Car]:
    return list(cars_db)


@app.post("/api/admin/cars", response_model=Car, status_code=status.HTTP_201_CREATED)
def admin_create_car(payload: CarCreate, _: str = Depends(get_current_admin)) -> Car:
    car = Car(**payload.model_dump())
    cars_db.append(car)
    return car


@app.put("/api/admin/cars/{car_id}", response_model=Car)
def admin_update_car(car_id: str, payload: CarUpdate, _: str = Depends(get_current_admin)) -> Car:
    for index, car in enumerate(cars_db):
        if car.id == car_id:
            updated_data = car.model_dump()
            for key, value in payload.model_dump(exclude_unset=True).items():
                updated_data[key] = value
            updated_car = Car(**updated_data)
            cars_db[index] = updated_car
            return updated_car
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")


@app.delete("/api/admin/cars/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_car(car_id: str, _: str = Depends(get_current_admin)) -> None:
    global cars_db
    cars_db = [c for c in cars_db if c.id != car_id]


@app.get("/api/admin/messages", response_model=List[ContactMessage])
def admin_list_messages(_: str = Depends(get_current_admin)) -> List[ContactMessage]:
    return list(messages_db)


@app.put("/api/admin/messages/{message_id}", response_model=ContactMessage)
def admin_update_message_status(message_id: str, status_value: str, _: str = Depends(get_current_admin)) -> ContactMessage:
    for index, message in enumerate(messages_db):
        if message.id == message_id:
            updated = message.model_copy(update={"status": status_value})
            messages_db[index] = updated
            return updated
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")


@app.get("/api/admin/test-drives", response_model=List[TestDriveBooking])
def admin_list_test_drives(_: str = Depends(get_current_admin)) -> List[TestDriveBooking]:
    return list(test_drives_db)


@app.get("/api/admin/notify-subscriptions", response_model=List[NotifySubscription])
def admin_list_notify_subscriptions(_: str = Depends(get_current_admin)) -> List[NotifySubscription]:
    return list(notify_subscriptions_db)


@app.get("/api/admin/callbacks", response_model=List[CallbackRequest])
def admin_list_callbacks(_: str = Depends(get_current_admin)) -> List[CallbackRequest]:
    return sorted(callback_requests_db, key=lambda x: x.created_at, reverse=True)


@app.put("/api/admin/callbacks/{callback_id}", response_model=CallbackRequest)
def admin_update_callback_status(
    callback_id: str, status_value: str = Query(alias="status_value"), _: str = Depends(get_current_admin)
) -> CallbackRequest:
    for i, req in enumerate(callback_requests_db):
        if req.id == callback_id:
            updated = req.model_copy(update={"status": status_value})
            callback_requests_db[i] = updated
            return updated
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Callback not found")


@app.get("/api/admin/chat/sessions", response_model=List[ChatSession])
def admin_list_chat_sessions(_: str = Depends(get_current_admin)) -> List[ChatSession]:
    return sorted(chat_sessions_db, key=lambda x: x.last_message_at, reverse=True)


@app.get("/api/admin/chat/sessions/{session_id}/messages", response_model=List[ChatMessage])
def admin_get_chat_messages(session_id: str, _: str = Depends(get_current_admin)) -> List[ChatMessage]:
    return sorted([m for m in chat_messages_db if m.session_id == session_id], key=lambda x: x.created_at)


@app.post("/api/admin/chat/sessions/{session_id}/messages", response_model=ChatMessage, status_code=status.HTTP_201_CREATED)
def admin_send_chat_message(
    session_id: str, payload: ChatMessageCreate, _: str = Depends(get_current_admin)
) -> ChatMessage:
    admin_payload = ChatMessageCreate(text=payload.text, is_admin=True)
    return send_chat_message(session_id, admin_payload)


@app.get("/api/cars/colors", response_model=List[str])
def list_colors() -> List[str]:
    colors = sorted({c.color for c in cars_db if c.color})
    return colors

