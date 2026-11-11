
const $ = id => document.getElementById(id);
const money = amount => "₹" + Number(amount || 0).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0, 10);

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const initialRooms = [
  {id:1,number:"101",type:"Standard",price:1800,capacity:2,status:"Occupied"},
  {id:2,number:"102",type:"Deluxe",price:2500,capacity:2,status:"Occupied"},
  {id:3,number:"103",type:"Suite",price:4500,capacity:4,status:"Available"},
  {id:4,number:"104",type:"Standard",price:1800,capacity:2,status:"Available"},
  {id:5,number:"105",type:"Deluxe",price:2500,capacity:3,status:"Occupied"},
  {id:6,number:"106",type:"Suite",price:4500,capacity:4,status:"Available"},
  {id:7,number:"107",type:"Standard",price:1800,capacity:2,status:"Available"},
  {id:8,number:"108",type:"Deluxe",price:2500,capacity:2,status:"Maintenance"},
  {id:9,number:"201",type:"Suite",price:5000,capacity:4,status:"Occupied"},
  {id:10,number:"202",type:"Standard",price:1800,capacity:2,status:"Available"},
  {id:11,number:"203",type:"Deluxe",price:2800,capacity:3,status:"Available"},
  {id:12,number:"204",type:"Presidential",price:8500,capacity:5,status:"Available"},
  {id:13,number:"205",type:"Suite",price:4500,capacity:4,status:"Available"},
  {id:14,number:"206",type:"Standard",price:1800,capacity:2,status:"Available"},
  {id:15,number:"207",type:"Deluxe",price:2800,capacity:3,status:"Available"}
];

const initialCustomers = [
  {id:1,name:"Rahul Sharma",email:"rahul@gmail.com",phone:"9876543210",city:"Delhi"},
  {id:2,name:"Priya Verma",email:"priya@gmail.com",phone:"9876543211",city:"Mumbai"},
  {id:3,name:"Aman Gupta",email:"aman@gmail.com",phone:"9876543212",city:"Chandigarh"},
  {id:4,name:"Neha Singh",email:"neha@gmail.com",phone:"9876543213",city:"Jaipur"},
  {id:5,name:"Rohit Mehta",email:"rohit@gmail.com",phone:"9876543214",city:"Panchkula"},
  {id:6,name:"Ananya Kapoor",email:"ananya@gmail.com",phone:"9876543215",city:"Delhi"},
  {id:7,name:"Karan Malhotra",email:"karan@gmail.com",phone:"9876543216",city:"Amritsar"},
  {id:8,name:"Simran Kaur",email:"simran@gmail.com",phone:"9876543217",city:"Ludhiana"},
  {id:9,name:"Arjun Patel",email:"arjun@gmail.com",phone:"9876543218",city:"Ahmedabad"},
  {id:10,name:"Isha Sharma",email:"isha@gmail.com",phone:"9876543219",city:"Shimla"}
];

const initialBookings = [
  {id:1001,customerId:1,roomId:1,checkIn:dateOffset(-1),checkOut:dateOffset(2),amount:5400,status:"Checked In",payment:"Paid",method:"UPI"},
  {id:1002,customerId:2,roomId:2,checkIn:dateOffset(-1),checkOut:dateOffset(2),amount:7500,status:"Checked In",payment:"Paid",method:"Card"},
  {id:1003,customerId:3,roomId:5,checkIn:dateOffset(-2),checkOut:dateOffset(1),amount:7500,status:"Checked In",payment:"Paid",method:"Cash"},
  {id:1004,customerId:4,roomId:9,checkIn:dateOffset(-1),checkOut:dateOffset(3),amount:20000,status:"Checked In",payment:"Pending",method:"UPI"},
  {id:1005,customerId:5,roomId:3,checkIn:dateOffset(2),checkOut:dateOffset(4),amount:9000,status:"Booked",payment:"Paid",method:"UPI"},
  {id:1006,customerId:6,roomId:6,checkIn:dateOffset(3),checkOut:dateOffset(5),amount:9000,status:"Booked",payment:"Pending",method:"Cash"},
  {id:1007,customerId:7,roomId:11,checkIn:dateOffset(4),checkOut:dateOffset(6),amount:5600,status:"Booked",payment:"Paid",method:"Card"},
  {id:1008,customerId:8,roomId:12,checkIn:dateOffset(5),checkOut:dateOffset(7),amount:17000,status:"Booked",payment:"Pending",method:"UPI"},
  {id:1009,customerId:9,roomId:13,checkIn:dateOffset(-5),checkOut:dateOffset(-3),amount:9000,status:"Checked Out",payment:"Paid",method:"Card"},
  {id:1010,customerId:10,roomId:14,checkIn:dateOffset(-8),checkOut:dateOffset(-6),amount:3600,status:"Checked Out",payment:"Paid",method:"Cash"},
  {id:1011,customerId:1,roomId:4,checkIn:dateOffset(-10),checkOut:dateOffset(-8),amount:3600,status:"Cancelled",payment:"Pending",method:"UPI"},
  {id:1012,customerId:3,roomId:15,checkIn:dateOffset(-12),checkOut:dateOffset(-10),amount:5600,status:"Checked Out",payment:"Paid",method:"UPI"}
];

// Load demo data once. Existing old demo data will be refreshed to this version.
const DATA_VERSION = "grandstay-v2";

let rooms, customers, bookings;

function saveData() {
  localStorage.setItem("grandstay_rooms", JSON.stringify(rooms));
  localStorage.setItem("grandstay_customers", JSON.stringify(customers));
  localStorage.setItem("grandstay_bookings", JSON.stringify(bookings));
  localStorage.setItem("grandstay_version", DATA_VERSION);
}

function loadData() {
  if (localStorage.getItem("grandstay_version") !== DATA_VERSION) {
    rooms = structuredClone(initialRooms);
    customers = structuredClone(initialCustomers);
    bookings = structuredClone(initialBookings);
    saveData();
  } else {
    rooms = JSON.parse(localStorage.getItem("grandstay_rooms") || "[]");
    customers = JSON.parse(localStorage.getItem("grandstay_customers") || "[]");
    bookings = JSON.parse(localStorage.getItem("grandstay_bookings") || "[]");
  }
}

let editingId = null;
let modalType = null;

function customerName(id) {
  return customers.find(c => c.id === Number(id))?.name || "Unknown Customer";
}

function roomDetails(id) {
  return rooms.find(r => r.id === Number(id));
}

function roomNumber(id) {
  return roomDetails(id)?.number || "Deleted Room";
}

function badge(status) {
  return `<span class="status status-${String(status).toLowerCase().replaceAll(" ", "-")}">${status}</span>`;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
  const target = $(page);
  if (!target) return;
  target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  const titles = {
    dashboard:"Dashboard",
    rooms:"Room Management",
    customers:"Customers",
    bookings:"Bookings",
    payments:"Payments",
    reports:"Reports"
  };
  $("page-heading").textContent = titles[page] || "Dashboard";
  renderAll();
}

function renderDashboard() {
  $("total-rooms").textContent = rooms.length;
  $("available-rooms").textContent = rooms.filter(r => r.status === "Available").length;
  $("active-bookings").textContent = bookings.filter(b => ["Booked","Checked In"].includes(b.status)).length;

  const revenue = bookings
    .filter(b => b.payment === "Paid" && b.status !== "Cancelled")
    .reduce((sum, b) => sum + Number(b.amount), 0);

  $("total-revenue").textContent = money(revenue);

  const recent = [...bookings].sort((a,b) => b.id-a.id).slice(0,6);
  $("dashboard-bookings").innerHTML = recent.length ? recent.map(b => `
    <tr>
      <td><strong>#${b.id}</strong></td>
      <td>${customerName(b.customerId)}</td>
      <td>${roomNumber(b.roomId)}</td>
      <td>${badge(b.status)}</td>
      <td>${money(b.amount)}</td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="empty">No bookings available</td></tr>`;

  const statuses = ["Available","Occupied","Maintenance"];
  const colors = {Available:"#21966b",Occupied:"#5087c7",Maintenance:"#ce8a32"};

  $("room-summary").innerHTML = statuses.map(status => {
    const count = rooms.filter(r => r.status === status).length;
    const percent = rooms.length ? count / rooms.length * 100 : 0;
    return `
      <div class="summary-row">
        <span>${status}</span><span>${count} rooms</span>
        <div class="progress"><span style="width:${percent}%;background:${colors[status]}"></span></div>
      </div>
    `;
  }).join("");
}

function renderRooms() {
  const search = ($("room-search")?.value || "").toLowerCase();
  const filter = $("room-filter")?.value || "";

  const filtered = rooms.filter(r =>
    (r.number.toLowerCase().includes(search) || r.type.toLowerCase().includes(search)) &&
    (!filter || r.status === filter)
  );

  $("rooms-table").innerHTML = filtered.length ? filtered.map(r => `
    <tr>
      <td><strong>${r.number}</strong></td>
      <td>${r.type}</td>
      <td>${money(r.price)}</td>
      <td>${r.capacity} Guests</td>
      <td>${badge(r.status)}</td>
      <td><div class="action-buttons">
        <button class="mini-btn" data-edit-room="${r.id}">Edit</button>
        <button class="mini-btn danger" data-delete-room="${r.id}">Delete</button>
      </div></td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="empty">No rooms found</td></tr>`;
}

function renderCustomers() {
  const search = ($("customer-search")?.value || "").toLowerCase();

  const filtered = customers.filter(c =>
    [c.name,c.email,c.phone,c.city].some(value => String(value).toLowerCase().includes(search))
  );

  $("customers-table").innerHTML = filtered.length ? filtered.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.city}</td>
      <td><div class="action-buttons">
        <button class="mini-btn" data-edit-customer="${c.id}">Edit</button>
        <button class="mini-btn danger" data-delete-customer="${c.id}">Delete</button>
      </div></td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="empty">No customers found</td></tr>`;
}

function renderBookings() {
  const search = ($("booking-search")?.value || "").toLowerCase();
  const filter = $("booking-filter")?.value || "";

  const filtered = [...bookings].sort((a,b) => b.id-a.id).filter(b =>
    (String(b.id).includes(search) || customerName(b.customerId).toLowerCase().includes(search)) &&
    (!filter || b.status === filter)
  );

  $("bookings-table").innerHTML = filtered.length ? filtered.map(b => `
    <tr>
      <td><strong>#${b.id}</strong></td>
      <td>${customerName(b.customerId)}</td>
      <td>${roomNumber(b.roomId)}</td>
      <td>${b.checkIn}</td>
      <td>${b.checkOut}</td>
      <td>${money(b.amount)}</td>
      <td>${badge(b.status)}</td>
      <td><div class="action-buttons">
        ${b.status === "Booked" ? `<button class="mini-btn" data-checkin="${b.id}">Check-in</button>` : ""}
        ${b.status === "Checked In" ? `<button class="mini-btn" data-checkout="${b.id}">Check-out</button>` : ""}
        ${["Booked","Checked In"].includes(b.status) ? `<button class="mini-btn danger" data-cancel-booking="${b.id}">Cancel</button>` : ""}
      </div></td>
    </tr>
  `).join("") : `<tr><td colspan="8" class="empty">No bookings found</td></tr>`;
}

function renderPayments() {
  const paid = bookings.filter(b => b.payment === "Paid" && b.status !== "Cancelled")
    .reduce((sum,b) => sum + Number(b.amount),0);
  const pending = bookings.filter(b => b.payment === "Pending" && b.status !== "Cancelled")
    .reduce((sum,b) => sum + Number(b.amount),0);

  $("paid-amount").textContent = money(paid);
  $("pending-amount").textContent = money(pending);
  $("transactions-count").textContent = bookings.filter(b => b.status !== "Cancelled").length;

  $("payments-table").innerHTML = bookings.filter(b => b.status !== "Cancelled")
    .sort((a,b) => b.id-a.id).map(b => `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>${customerName(b.customerId)}</td>
        <td>${b.checkIn}</td>
        <td>${b.method}</td>
        <td>${money(b.amount)}</td>
        <td>${badge(b.payment)}</td>
        <td>${b.payment === "Pending" ? `<button class="mini-btn" data-pay="${b.id}">Mark Paid</button>` : "—"}</td>
      </tr>
    `).join("");
}

function renderReports() {
  const paid = bookings.filter(b => b.payment === "Paid" && b.status !== "Cancelled")
    .reduce((sum,b) => sum + Number(b.amount),0);
  const pending = bookings.filter(b => b.payment === "Pending" && b.status !== "Cancelled")
    .reduce((sum,b) => sum + Number(b.amount),0);

  $("report-customers").textContent = customers.length;
  $("report-bookings").textContent = bookings.length;
  $("report-revenue").textContent = money(paid);
  $("report-pending").textContent = money(pending);

  const bookingStatuses = ["Booked","Checked In","Checked Out","Cancelled"];
  $("booking-report").innerHTML = bookingStatuses.map(status => `
    <div class="report-line"><span>${status}</span><strong>${bookings.filter(b => b.status === status).length}</strong></div>
  `).join("");

  const roomStatuses = ["Available","Occupied","Maintenance"];
  $("inventory-report").innerHTML = roomStatuses.map(status => `
    <div class="report-line"><span>${status} Rooms</span><strong>${rooms.filter(r => r.status === status).length}</strong></div>
  `).join("");

  $("revenue-detail").textContent =
    `GrandStay has recorded ${money(paid)} in paid booking revenue. Pending payments total ${money(pending)}. There are ${bookings.length} total booking records and ${customers.length} registered customers.`;
}

function renderAll() {
  renderDashboard();
  renderRooms();
  renderCustomers();
  renderBookings();
  renderPayments();
  renderReports();
}

function openModal(type, id = null) {
  modalType = type;
  editingId = id;
  const isEdit = id !== null;
  const record = isEdit ? (
    type === "room" ? rooms.find(x => x.id === id) :
    type === "customer" ? customers.find(x => x.id === id) : null
  ) : null;

  let fields = "";
  const input = (label,name,value="",kind="text",required=true) => `
    <div class="field">
      <label>${label}</label>
      <input name="${name}" type="${kind}" value="${String(value ?? "").replaceAll('"',"&quot;")}" ${required ? "required" : ""}>
    </div>
  `;
  const select = (label,name,options,selected="") => `
    <div class="field">
      <label>${label}</label>
      <select name="${name}" required>
        ${options.map(option => `<option value="${option.value}" ${String(option.value) === String(selected) ? "selected" : ""}>${option.label}</option>`).join("")}
      </select>
    </div>
  `;

  if (type === "room") {
    fields += input("Room Number","number",record?.number || "");
    fields += select("Room Type","type",[
      {value:"Standard",label:"Standard"},
      {value:"Deluxe",label:"Deluxe"},
      {value:"Suite",label:"Suite"},
      {value:"Presidential",label:"Presidential"}
    ],record?.type || "Standard");
    fields += input("Price Per Night (₹)","price",record?.price || 1800,"number");
    fields += input("Guest Capacity","capacity",record?.capacity || 2,"number");
    fields += select("Room Status","status",["Available","Occupied","Maintenance"].map(x => ({value:x,label:x})),record?.status || "Available");
  }

  if (type === "customer") {
    fields += input("Full Name","name",record?.name || "");
    fields += input("Email Address","email",record?.email || "","email");
    fields += input("Phone Number","phone",record?.phone || "","tel");
    fields += input("City","city",record?.city || "");
  }

  if (type === "booking") {
    const availableRooms = rooms.filter(r => r.status === "Available");
    if (!customers.length) {
      showToast("Please add a customer before creating a booking.");
      return;
    }
    if (!availableRooms.length) {
      showToast("No available rooms. Add or free a room first.");
      return;
    }

    fields += select("Select Customer","customerId",customers.map(c => ({value:c.id,label:c.name})));
    fields += select("Select Room","roomId",availableRooms.map(r => ({value:r.id,label:`${r.number} - ${r.type} (${money(r.price)}/night)`})));
    fields += input("Check-in Date","checkIn",today(),"date");
    fields += input("Check-out Date","checkOut",dateOffset(1),"date");
    fields += select("Payment Method","method",["UPI","Cash","Card","Net Banking"].map(x => ({value:x,label:x})),"UPI");
    fields += `<div class="form-hint">The booking amount is calculated automatically from the room price and number of nights. New bookings are initially marked as pending check-in.</div>`;
  }

  $("modal-title").textContent = `${isEdit ? "Edit" : "Add"} ${type.charAt(0).toUpperCase()+type.slice(1)}`;
  $("modal-fields").innerHTML = fields;
  $("modal-backdrop").classList.add("show");
}

function closeModal() {
  $("modal-backdrop").classList.remove("show");
  $("data-form").reset();
  editingId = null;
  modalType = null;
}

function saveForm(event) {
  event.preventDefault();
  const formData = new FormData($("data-form"));
  const data = Object.fromEntries(formData.entries());

  if (modalType === "room") {
    const price = Number(data.price);
    const capacity = Number(data.capacity);
    if (price <= 0 || capacity <= 0) {
      showToast("Price and capacity must be greater than zero.");
      return;
    }

    if (editingId) {
      const room = rooms.find(r => r.id === editingId);
      Object.assign(room, {...data, price, capacity});
    } else {
      if (rooms.some(r => r.number.toLowerCase() === data.number.toLowerCase())) {
        showToast("This room number already exists.");
        return;
      }
      rooms.push({id:Date.now(),...data,price,capacity});
    }
  }

  if (modalType === "customer") {
    if (!/^\d{10}$/.test(data.phone)) {
      showToast("Enter a valid 10-digit phone number.");
      return;
    }
    if (editingId) {
      Object.assign(customers.find(c => c.id === editingId), data);
    } else {
      customers.push({id:Date.now(),...data});
    }
  }

  if (modalType === "booking") {
    const roomId = Number(data.roomId);
    const customerId = Number(data.customerId);
    const room = rooms.find(r => r.id === roomId);
    const checkIn = new Date(data.checkIn + "T00:00:00");
    const checkOut = new Date(data.checkOut + "T00:00:00");
    const nights = Math.round((checkOut-checkIn)/86400000);

    if (!room || room.status !== "Available") {
      showToast("Please select an available room.");
      return;
    }
    if (checkOut <= checkIn || nights < 1) {
      showToast("Check-out date must be after check-in date.");
      return;
    }

    const amount = nights * Number(room.price);
    bookings.push({
      id:Math.max(1000,...bookings.map(b => b.id))+1,
      customerId, roomId, checkIn:data.checkIn, checkOut:data.checkOut,
      amount, status:"Booked", payment:"Pending", method:data.method
    });
    room.status = "Occupied";
  }

  saveData();
  closeModal();
  renderAll();
  showToast(editingId ? "Details updated successfully!" : "Details saved successfully!");
}

function deleteRoom(id) {
  const room = rooms.find(r => r.id === id);
  if (!room) return;
  if (bookings.some(b => b.roomId === id && ["Booked","Checked In"].includes(b.status))) {
    showToast("This room has an active booking and cannot be deleted.");
    return;
  }
  if (!confirm(`Delete room ${room.number}?`)) return;
  rooms = rooms.filter(r => r.id !== id);
  saveData(); renderAll(); showToast("Room deleted.");
}

function deleteCustomer(id) {
  if (bookings.some(b => b.customerId === id && ["Booked","Checked In"].includes(b.status))) {
    showToast("This customer has an active booking and cannot be deleted.");
    return;
  }
  if (!confirm("Delete this customer?")) return;
  customers = customers.filter(c => c.id !== id);
  saveData(); renderAll(); showToast("Customer deleted.");
}

function updateBookingStatus(id, status) {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return;
  const room = roomDetails(booking.roomId);

  booking.status = status;
  if (room && (status === "Checked Out" || status === "Cancelled")) {
    room.status = "Available";
  }
  if (room && status === "Checked In") {
    room.status = "Occupied";
  }

  saveData();
  renderAll();
  showToast(`Booking #${id} updated to ${status}.`);
}

function markPaymentPaid(id) {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return;
  booking.payment = "Paid";
  saveData();
  renderAll();
  showToast("Payment marked as paid.");
}

// Navigation buttons and quick actions
document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    showPage(pageButton.dataset.page);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    if (action === "add-room") openModal("room");
    if (action === "add-customer") openModal("customer");
    if (action === "add-booking") openModal("booking");
    return;
  }

  const editRoom = event.target.closest("[data-edit-room]");
  if (editRoom) return openModal("room", Number(editRoom.dataset.editRoom));

  const deleteRoomButton = event.target.closest("[data-delete-room]");
  if (deleteRoomButton) return deleteRoom(Number(deleteRoomButton.dataset.deleteRoom));

  const editCustomer = event.target.closest("[data-edit-customer]");
  if (editCustomer) return openModal("customer", Number(editCustomer.dataset.editCustomer));

  const deleteCustomerButton = event.target.closest("[data-delete-customer]");
  if (deleteCustomerButton) return deleteCustomer(Number(deleteCustomerButton.dataset.deleteCustomer));

  const checkin = event.target.closest("[data-checkin]");
  if (checkin) return updateBookingStatus(Number(checkin.dataset.checkin), "Checked In");

  const checkout = event.target.closest("[data-checkout]");
  if (checkout) return updateBookingStatus(Number(checkout.dataset.checkout), "Checked Out");

  const cancel = event.target.closest("[data-cancel-booking]");
  if (cancel) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      updateBookingStatus(Number(cancel.dataset.cancelBooking), "Cancelled");
    }
    return;
  }

  const pay = event.target.closest("[data-pay]");
  if (pay) return markPaymentPaid(Number(pay.dataset.pay));
});

$("data-form").addEventListener("submit", saveForm);
$("close-modal").addEventListener("click", closeModal);
$("cancel-modal").addEventListener("click", closeModal);

$("modal-backdrop").addEventListener("click", event => {
  if (event.target === $("modal-backdrop")) closeModal();
});

$("room-search").addEventListener("input", renderRooms);
$("room-filter").addEventListener("change", renderRooms);
$("customer-search").addEventListener("input", renderCustomers);
$("booking-search").addEventListener("input", renderBookings);
$("booking-filter").addEventListener("change", renderBookings);
$("print-report").addEventListener("click", () => window.print());

// Initial page setup
loadData();
$("today-date").textContent = new Date().toLocaleDateString("en-IN", {
  day:"numeric", month:"short", year:"numeric"
});
renderAll();
