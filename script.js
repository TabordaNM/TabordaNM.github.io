document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const navLinks = document.querySelectorAll('.nav ul li a');
    const sections = document.querySelectorAll('.section');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');

    // Dashboard
    const kpiTotalShipments = document.getElementById('kpiTotalShipments');
    const kpiInTransit = document.getElementById('kpiInTransit');
    const kpiDelivered = document.getElementById('kpiDelivered');
    const kpiDelayed = document.getElementById('kpiDelayed');
    const shipmentsStatusChartCanvas = document.getElementById('shipmentsStatusChart');
    const shipmentsStatusChartLegend = document.getElementById('shipmentsStatusChart-legend');
    const monthlyShipmentsChartCanvas = document.getElementById('monthlyShipmentsChart');
    const topOriginsChartCanvas = document.getElementById('topOriginsChart');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyDateFilterBtn = document.getElementById('applyDateFilter');
    const resetDateFilterBtn = document.getElementById('resetDateFilter');

    // Monitoreo de Envíos
    const shipmentsTableBody = document.querySelector('#shipmentsTable tbody');
    const shipmentSearchInput = document.getElementById('shipmentSearch');
    const shipmentStatusFilter = document.getElementById('shipmentStatusFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const shipmentsPerPage = 10;
    let currentShipmentsPage = 1;
    let filteredShipments = []; // Asegúrate de que esta variable sea let

    // Gestión de Flota
    const vehiclesTableBody = document.querySelector('#vehiclesTable tbody');
    const vehicleSearchInput = document.getElementById('vehicleSearch');
    const vehicleStatusFilter = document.getElementById('vehicleStatusFilter');
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const prevVehiclePageBtn = document.getElementById('prevVehiclePage');
    const nextVehiclePageBtn = document.getElementById('nextVehiclePage');
    const currentVehiclePageSpan = document.getElementById('currentVehiclePage');
    const totalVehiclePagesSpan = document.getElementById('totalVehiclePages');
    const vehiclesPerPage = 10;
    let currentVehiclePage = 1;
    let filteredVehicles = []; // Asegúrate de que esta variable sea let

    // Modales de Envíos
    const shipmentDetailsModal = document.getElementById('shipmentDetailsModal');
    const editShipmentModal = document.getElementById('editShipmentModal');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const cancelButtons = document.querySelectorAll('.modal .cancel-button');
    const editShipmentDetailsBtn = document.getElementById('editShipmentDetailsBtn');
    const editShipmentForm = document.getElementById('editShipmentForm');
    const shipmentModalTitle = document.getElementById('shipmentModalTitle');

    // Modales de Vehículos
    const vehicleDetailModal = document.getElementById('vehicleDetailModal');
    const addEditVehicleModal = document.getElementById('addEditVehicleModal');
    const editVehicleDetailsBtn = document.getElementById('editVehicleDetailsBtn');
    const addEditVehicleForm = document.getElementById('addEditVehicleForm');
    const vehicleModalTitle = document.getElementById('vehicleModalTitle');

    // --- Datos de Prueba (Simulados) ---
    // (Puedes reemplazar esto con datos de tu backend)
    let allShipments = [
        { id: 'ENV-001', origin: 'Bogotá', destination: 'Medellín', status: 'En Ruta', shipmentDate: '2024-06-01', deliveryDate: '2024-06-05', assignedVehicle: 'VEH-1001', notes: 'Entrega urgente.' },
        { id: 'ENV-002', origin: 'Medellín', destination: 'Cali', status: 'Entregado', shipmentDate: '2024-05-28', deliveryDate: '2024-05-30', assignedVehicle: 'VEH-1002', notes: 'Recogido por cliente.' },
        { id: 'ENV-003', origin: 'Bogotá', destination: 'Barranquilla', status: 'Pendiente', shipmentDate: '2024-06-03', deliveryDate: '2024-06-07', assignedVehicle: 'N/A', notes: 'Esperando vehículo.' },
        { id: 'ENV-004', origin: 'Cali', destination: 'Bogotá', status: 'Retrasado', shipmentDate: '2024-05-25', deliveryDate: '2024-05-27', assignedVehicle: 'VEH-1003', notes: 'Problemas en carretera.' },
        { id: 'ENV-005', origin: 'Barranquilla', destination: 'Cartagena', status: 'En Ruta', shipmentDate: '2024-06-02', deliveryDate: '2024-06-04', assignedVehicle: 'VEH-1004', notes: 'Entrega normal.' },
        { id: 'ENV-006', origin: 'Bogotá', destination: 'Cúcuta', status: 'Pendiente', shipmentDate: '2024-06-04', deliveryDate: '2024-06-08', assignedVehicle: 'N/A', notes: 'Documentación en proceso.' },
        { id: 'ENV-007', origin: 'Medellín', destination: 'Bucaramanga', status: 'En Ruta', shipmentDate: '2024-06-01', deliveryDate: '2024-06-03', assignedVehicle: 'VEH-1005', notes: 'Producto frágil.' },
        { id: 'ENV-008', origin: 'Cali', destination: 'Pereira', status: 'Entregado', shipmentDate: '2024-05-29', deliveryDate: '2024-05-30', assignedVehicle: 'VEH-1006', notes: 'Cliente satisfecho.' },
        { id: 'ENV-009', origin: 'Bogotá', destination: 'Manizales', status: 'Retrasado', shipmentDate: '2024-05-20', deliveryDate: '2024-05-22', assignedVehicle: 'VEH-1007', notes: 'Mal tiempo.' },
        { id: 'ENV-010', origin: 'Cartagena', destination: 'Armenia', status: 'Cancelado', shipmentDate: '2024-05-15', deliveryDate: '2024-05-18', assignedVehicle: 'N/A', notes: 'Pedido cancelado por cliente.' },
        { id: 'ENV-011', origin: 'Bogotá', destination: 'Medellín', status: 'En Ruta', shipmentDate: '2024-06-05', deliveryDate: '2024-06-09', assignedVehicle: 'VEH-1001', notes: 'Ruta estándar.' },
        { id: 'ENV-012', origin: 'Medellín', destination: 'Bogotá', status: 'Entregado', shipmentDate: '2024-06-03', deliveryDate: '2024-06-05', assignedVehicle: 'VEH-1002', notes: 'Entrega exitosa.' },
        { id: 'ENV-013', origin: 'Bogotá', destination: 'Cali', status: 'Pendiente', shipmentDate: '2024-06-06', deliveryDate: '2024-06-10', assignedVehicle: 'N/A', notes: 'Esperando confirmación.' },
        { id: 'ENV-014', origin: 'Cali', destination: 'Barranquilla', status: 'En Ruta', shipmentDate: '2024-06-04', deliveryDate: '2024-06-08', assignedVehicle: 'VEH-1003', notes: 'Carga pesada.' },
        { id: 'ENV-015', origin: 'Barranquilla', destination: 'Bucaramanga', status: 'Entregado', shipmentDate: '2024-06-01', deliveryDate: '2024-06-03', assignedVehicle: 'VEH-1004', notes: 'Sin novedades.' },
        { id: 'ENV-016', origin: 'Bogotá', destination: 'Pereira', status: 'En Ruta', shipmentDate: '2024-06-07', deliveryDate: '2024-06-11', assignedVehicle: 'VEH-1005', notes: 'Entrega programada.' },
        { id: 'ENV-017', origin: 'Medellín', destination: 'Manizales', status: 'Pendiente', shipmentDate: '2024-06-08', deliveryDate: '2024-06-12', assignedVehicle: 'N/A', notes: 'Esperando ruta.' },
        { id: 'ENV-018', origin: 'Cúcuta', destination: 'Bogotá', status: 'Retrasado', shipmentDate: '2024-06-02', deliveryDate: '2024-06-05', assignedVehicle: 'VEH-1006', notes: 'Demora por papeleo.' },
        { id: 'ENV-019', origin: 'Cartagena', destination: 'Medellín', status: 'En Ruta', shipmentDate: '2024-06-06', deliveryDate: '2024-06-10', assignedVehicle: 'VEH-1007', notes: 'Ruta costera.' },
        { id: 'ENV-020', origin: 'Bogotá', destination: 'Armenia', status: 'Entregado', shipmentDate: '2024-06-03', deliveryDate: '2024-06-05', assignedVehicle: 'VEH-1001', notes: 'Entrega finalizada.' }
    ];

    let allVehicles = [
        { id: 'VEH-1001', type: 'Camión', model: 'Volvo FH', licensePlate: 'ABC-123', capacity: 15000, status: 'En Ruta', lastMaintenance: '2024-05-10', maintenanceHistory: 'Cambio de aceite, revisión de frenos.' },
        { id: 'VEH-1002', type: 'Furgón', model: 'Renault Master', licensePlate: 'DEF-456', capacity: 3500, status: 'Disponible', lastMaintenance: '2024-06-01', maintenanceHistory: 'Revisión general.' },
        { id: 'VEH-1003', type: 'Camioneta', model: 'Chevrolet D-Max', licensePlate: 'GHI-789', capacity: 1200, status: 'En Mantenimiento', lastMaintenance: '2024-06-05', maintenanceHistory: 'Reparación de motor.' },
        { id: 'VEH-1004', type: 'Trailer', model: 'Kenworth T680', licensePlate: 'JKL-012', capacity: 25000, status: 'En Ruta', lastMaintenance: '2024-05-20', maintenanceHistory: 'Inspección de rutina.' },
        { id: 'VEH-1005', type: 'Camión', model: 'Mercedes-Benz Actros', licensePlate: 'MNO-345', capacity: 18000, status: 'Disponible', lastMaintenance: '2024-05-25', maintenanceHistory: 'Neumáticos nuevos.' },
        { id: 'VEH-1006', type: 'Furgón', model: 'Ford Transit', licensePlate: 'PQR-678', capacity: 3000, status: 'En Ruta', lastMaintenance: '2024-06-02', maintenanceHistory: 'Revisión pre-viaje.' },
        { id: 'VEH-1007', type: 'Camioneta', model: 'Nissan Frontier', licensePlate: 'STU-901', capacity: 1000, status: 'Inactivo', lastMaintenance: '2024-04-15', maintenanceHistory: 'Esperando repuestos.' }
    ];

    // --- NUEVAS: Variables para el Mapa ---
    let map; // Variable para almacenar la instancia del mapa de Leaflet
    let currentRoutes = []; // Para guardar las capas de rutas (polilíneas y marcadores) y poder eliminarlas

    // --- NUEVOS: Datos de ejemplo para coordenadas de ciudades ---
    // En una aplicación real, estas coordenadas vendrían de una base de datos o API de geocodificación.
    const cityCoordinates = {
        "Bogotá": [4.7110, -74.0721],
        "Medellín": [6.2442, -75.5812],
        "Cali": [3.4516, -76.5320],
        "Barranquilla": [10.9685, -74.7813],
        "Cartagena": [10.3910, -75.4794],
        "Bucaramanga": [7.1254, -73.1198],
        "Cúcuta": [7.8939, -72.4962],
        "Pereira": [4.8000, -75.6961],
        "Manizales": [5.0689, -75.5173],
        "Armenia": [4.5367, -75.6811]
        // ¡Añade más ciudades colombianas que uses en tus envíos!
    };


    // --- Funciones de Utilidad ---
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'En Ruta': return 'in-ruta';
            case 'Entregado': return 'entregado';
            case 'Pendiente': return 'pendiente';
            case 'Retrasado': return 'retrasado';
            case 'Cancelado': return 'cancelado';
            case 'Disponible': return 'disponible';
            case 'En Mantenimiento': return 'en-mantenimiento';
            case 'Inactivo': return 'inactivo';
            default: return '';
        }
    };

    const closeModals = () => {
        shipmentDetailsModal.classList.remove('active');
        editShipmentModal.classList.remove('active');
        vehicleDetailModal.classList.remove('active');
        addEditVehicleModal.classList.remove('active');
    };

    // --- NUEVA: Función para inicializar el Mapa de Envíos ---
    const initializeShipmentMap = () => {
        // Solo inicializar el mapa si aún no ha sido inicializado
        if (!map) {
            map = L.map('shipmentMap').setView([4.6243335, -74.063644], 6); // Centro de Colombia, zoom inicial

            // Añadir capa base de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // IMPORTANTE: Invalidar el tamaño del mapa cuando la sección sea visible.
            // Esto es necesario si el mapa se encuentra en una pestaña o sección inicialmente oculta.
            // La lógica ya está en showSection, pero se mantiene el listener aquí por si acaso se necesita en otros contextos.
            // Se moverá el invalidateSize a showSection directamente para un manejo más centralizado.
        }
    };

    // --- NUEVA: Función para limpiar rutas y marcadores existentes del mapa ---
    const clearMapRoutes = () => {
        currentRoutes.forEach(layer => {
            if (map && map.hasLayer(layer)) { // Verificar si el mapa existe y la capa está en él
                map.removeLayer(layer);
            }
        });
        currentRoutes = []; // Vaciar el array
    };

    // --- NUEVA: Función para añadir una ruta (polyline y marcadores) al mapa ---
    const addShipmentRouteToMap = (originLocation, destinationLocation, shipmentId) => {
        if (!map) {
            console.warn("Mapa no inicializado. No se puede añadir la ruta para el envío:", shipmentId);
            return;
        }

        const originCoords = cityCoordinates[originLocation];
        const destinationCoords = cityCoordinates[destinationLocation];

        if (!originCoords) {
            console.warn(`Coordenadas de origen no encontradas para: ${originLocation}`);
            return;
        }
        if (!destinationCoords) {
            console.warn(`Coordenadas de destino no encontradas para: ${destinationLocation}`);
            return;
        }

        const routeCoords = [originCoords, destinationCoords];

        // Añadir la polilínea (la ruta)
        const polyline = L.polyline(routeCoords, {
            color: '#FF7F50', // Color coral de tu --accent-color
            weight: 4,
            opacity: 0.8,
            dashArray: '5, 5' // Opcional: línea punteada para simular movimiento o ruta
        }).addTo(map);
        currentRoutes.push(polyline); // Guardar la capa para poder limpiarla después

        // Añadir marcador en el origen
        const originMarker = L.marker(originCoords).addTo(map);
        originMarker.bindPopup(`<b>Origen:</b> ${originLocation}<br>Envío: ${shipmentId}`);
        currentRoutes.push(originMarker);

        // Añadir marcador en el destino
        const destinationMarker = L.marker(destinationCoords).addTo(map);
        destinationMarker.bindPopup(`<b>Destino:</b> ${destinationLocation}<br>Envío: ${shipmentId}`);
        currentRoutes.push(destinationMarker);

        // Opcional: ajustar el mapa para que muestre la ruta completa si es la primera ruta o si no hay otras rutas visibles
        if (currentRoutes.length === 3) { // Si es la primera ruta (polyline + 2 markers)
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] }); // Añadir un poco de padding alrededor de la ruta
        }
    };


    // --- Lógica del Sidebar y Navegación ---
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    const showSection = (sectionId) => {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
                // NUEVO: Lógica específica para la sección de Envíos y el mapa
                if (sectionId === 'envios') {
                    initializeShipmentMap(); // Asegura que el mapa esté inicializado
                    if (map) { // Verificar si el mapa ya fue creado
                        setTimeout(() => { // Pequeño retraso para que el contenedor esté renderizado y Leaflet calcule bien el tamaño
                            map.invalidateSize(); // Obliga a Leaflet a recalcular el tamaño del mapa
                            applyFilters(); // Vuelve a aplicar filtros para dibujar las rutas correctas
                        }, 100);
                    }
                }
            }
        });
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.nav ul li a[href="#${sectionId}"]`).classList.add('active');
    };

    // --- Lógica de Envíos ---
    const renderShipmentsTable = (shipments) => {
        shipmentsTableBody.innerHTML = '';
        const start = (currentShipmentsPage - 1) * shipmentsPerPage;
        const end = start + shipmentsPerPage;
        const paginatedShipments = shipments.slice(start, end);

        if (paginatedShipments.length === 0) {
            shipmentsTableBody.innerHTML = '<tr><td colspan="7">No se encontraron envíos.</td></tr>';
            return;
        }

        paginatedShipments.forEach(shipment => {
            const row = shipmentsTableBody.insertRow();
            row.insertCell(0).textContent = shipment.id;
            row.insertCell(1).textContent = shipment.origin;
            row.insertCell(2).textContent = shipment.destination;
            row.insertCell(3).innerHTML = `<span class="status-badge ${getStatusBadgeClass(shipment.status)}">${shipment.status}</span>`;
            row.insertCell(4).textContent = formatDate(shipment.shipmentDate);
            row.insertCell(5).textContent = formatDate(shipment.deliveryDate);

            const actionsCell = row.insertCell(6);
            actionsCell.classList.add('action-buttons');
            const viewBtn = document.createElement('button');
            viewBtn.classList.add('view-button');
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'Ver Detalles';
            viewBtn.addEventListener('click', () => openShipmentDetails(shipment.id));
            actionsCell.appendChild(viewBtn);

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar Envío';
            editBtn.addEventListener('click', () => openEditShipmentModal(shipment.id));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Eliminar Envío';
            deleteBtn.addEventListener('click', () => deleteShipment(shipment.id));
            actionsCell.appendChild(deleteBtn);
        });

        updateShipmentPagination(shipments.length);
    };

    const updateShipmentPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / shipmentsPerPage);
        currentPageSpan.textContent = currentShipmentsPage;
        totalPagesSpan.textContent = totalPages;
        prevPageBtn.disabled = currentShipmentsPage === 1;
        nextPageBtn.disabled = currentShipmentsPage === totalPages || totalPages === 0;
    };

    prevPageBtn.addEventListener('click', () => {
        if (currentShipmentsPage > 1) {
            currentShipmentsPage--;
            applyFilters();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);
        if (currentShipmentsPage < totalPages) {
            currentShipmentsPage++;
            applyFilters();
        }
    });

    const applyFilters = () => {
        const searchTerm = shipmentSearchInput.value.toLowerCase();
        const statusFilter = shipmentStatusFilter.value;

        filteredShipments = allShipments.filter(shipment => {
            const matchesSearch = Object.values(shipment).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
            const matchesStatus = statusFilter === '' || shipment.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        currentShipmentsPage = 1; // Reset to first page on new filter
        renderShipmentsTable(filteredShipments);

        // NUEVO: Limpiar y dibujar rutas en el mapa para los envíos filtrados
        clearMapRoutes(); // Limpiar rutas existentes

        filteredShipments.forEach(shipment => {
            // Asegúrate de que tus objetos 'shipment' tienen las propiedades 'origin' y 'destination'
            // con los nombres de las ciudades tal como los definiste en cityCoordinates.
            addShipmentRouteToMap(shipment.origin, shipment.destination, shipment.id);
        });

        // Si no hay envíos filtrados o no se pudieron dibujar rutas, centrar el mapa en Colombia
        if (filteredShipments.length === 0 || currentRoutes.length === 0) {
            if (map) { // Asegurarse de que el mapa existe antes de intentar moverlo
                map.setView([4.6243335, -74.0721], 6); // Centro de Colombia (aprox)
            }
        }
    };

    shipmentSearchInput.addEventListener('input', applyFilters);
    shipmentStatusFilter.addEventListener('change', applyFilters);

    // --- Lógica de Modales de Envíos ---
    const openShipmentDetails = (shipmentId) => {
        const shipment = allShipments.find(s => s.id === shipmentId);
        if (shipment) {
            document.getElementById('detailShipmentId').textContent = shipment.id;
            document.getElementById('detailOrigin').textContent = shipment.origin;
            document.getElementById('detailDestination').textContent = shipment.destination;
            document.getElementById('detailStatus').innerHTML = `<span class="status-badge ${getStatusBadgeClass(shipment.status)}">${shipment.status}</span>`;
            document.getElementById('detailShipmentDate').textContent = formatDate(shipment.shipmentDate);
            document.getElementById('detailDeliveryDate').textContent = formatDate(shipment.deliveryDate);
            document.getElementById('detailAssignedVehicle').textContent = shipment.assignedVehicle;
            document.getElementById('detailNotes').textContent = shipment.notes;
            shipmentDetailsModal.classList.add('active');
            shipmentDetailsModal.dataset.shipmentId = shipmentId; // Store ID for editing
        }
    };

    const openEditShipmentModal = (shipmentId = null) => {
        if (shipmentId) {
            // Edit existing shipment
            const shipment = allShipments.find(s => s.id === shipmentId);
            if (shipment) {
                shipmentModalTitle.textContent = `Editar Envío ${shipmentId}`;
                document.getElementById('editShipmentId').value = shipment.id;
                document.getElementById('editOrigin').value = shipment.origin;
                document.getElementById('editDestination').value = shipment.destination;
                document.getElementById('editStatus').value = shipment.status;
                document.getElementById('editShipmentDate').value = shipment.shipmentDate;
                document.getElementById('editDeliveryDate').value = shipment.deliveryDate;
                document.getElementById('editAssignedVehicle').value = shipment.assignedVehicle;
                document.getElementById('editNotes').value = shipment.notes;
            }
        } else {
            // Add new shipment
            shipmentModalTitle.textContent = 'Añadir Nuevo Envío';
            editShipmentForm.reset(); // Clear form
            document.getElementById('editShipmentId').value = ''; // Ensure no ID is set for new
        }
        closeModals(); // Close any other open modals first
        editShipmentModal.classList.add('active');
    };

    editShipmentDetailsBtn.addEventListener('click', () => {
        const shipmentId = shipmentDetailsModal.dataset.shipmentId;
        closeModals(); // Close details modal
        openEditShipmentModal(shipmentId);
    });

    editShipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editShipmentId').value;
        const origin = document.getElementById('editOrigin').value;
        const destination = document.getElementById('editDestination').value;
        const status = document.getElementById('editStatus').value;
        const shipmentDate = document.getElementById('editShipmentDate').value;
        const deliveryDate = document.getElementById('editDeliveryDate').value;
        const assignedVehicle = document.getElementById('editAssignedVehicle').value;
        const notes = document.getElementById('editNotes').value;

        if (id) {
            // Update existing shipment
            const index = allShipments.findIndex(s => s.id === id);
            if (index !== -1) {
                allShipments[index] = { id, origin, destination, status, shipmentDate, deliveryDate, assignedVehicle, notes };
                alert(`Envío ${id} actualizado exitosamente.`);
            }
        } else {
            // Add new shipment
            const newId = 'ENV-' + String(allShipments.length + 1001).padStart(3, '0'); // Simple ID generation
            allShipments.push({ id: newId, origin, destination, status, shipmentDate, deliveryDate, assignedVehicle, notes });
            alert(`Envío ${newId} añadido exitosamente.`);
        }
        closeModals();
        applyFilters(); // Re-render table and update dashboard
        updateDashboardKPIs(); // Update dashboard KPIs
        renderDashboardCharts(); // Re-render dashboard charts
    });

    const deleteShipment = (shipmentId) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el envío con ID ${shipmentId}? Esta acción no se puede deshacer.`)) {
            allShipments = allShipments.filter(s => s.id !== shipmentId);
            alert(`Envío ${shipmentId} eliminado.`);
            applyFilters(); // Re-render table
            updateDashboardKPIs(); // Update dashboard KPIs
            renderDashboardCharts(); // Re-render dashboard charts
        }
    };


    // --- Lógica de Gestión de Flota ---
    const renderVehiclesTable = (vehicles) => {
        vehiclesTableBody.innerHTML = '';
        const start = (currentVehiclePage - 1) * vehiclesPerPage;
        const end = start + vehiclesPerPage;
        const paginatedVehicles = vehicles.slice(start, end);

        if (paginatedVehicles.length === 0) {
            vehiclesTableBody.innerHTML = '<tr><td colspan="8">No se encontraron vehículos.</td></tr>';
            return;
        }

        paginatedVehicles.forEach(vehicle => {
            const row = vehiclesTableBody.insertRow();
            row.insertCell(0).textContent = vehicle.id;
            row.insertCell(1).textContent = vehicle.type;
            row.insertCell(2).textContent = vehicle.model;
            row.insertCell(3).textContent = vehicle.licensePlate;
            row.insertCell(4).textContent = vehicle.capacity;
            row.insertCell(5).innerHTML = `<span class="status-badge ${getStatusBadgeClass(vehicle.status)}">${vehicle.status}</span>`;
            row.insertCell(6).textContent = formatDate(vehicle.lastMaintenance);

            const actionsCell = row.insertCell(7);
            actionsCell.classList.add('action-buttons');
            const viewBtn = document.createElement('button');
            viewBtn.classList.add('view-button');
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'Ver Detalles';
            viewBtn.addEventListener('click', () => openVehicleDetails(vehicle.id));
            actionsCell.appendChild(viewBtn);

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar Vehículo';
            editBtn.addEventListener('click', () => openAddEditVehicleModal(vehicle.id));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Eliminar Vehículo';
            deleteBtn.addEventListener('click', () => deleteVehicle(vehicle.id));
            actionsCell.appendChild(deleteBtn);
        });

        updateVehiclePagination(vehicles.length);
    };

    const updateVehiclePagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / vehiclesPerPage);
        currentVehiclePageSpan.textContent = currentVehiclePage;
        totalVehiclePagesSpan.textContent = totalPages;
        prevVehiclePageBtn.disabled = currentVehiclePage === 1;
        nextVehiclePageBtn.disabled = currentVehiclePage === totalPages || totalPages === 0;
    };

    prevVehiclePageBtn.addEventListener('click', () => {
        if (currentVehiclePage > 1) {
            currentVehiclePage--;
            applyVehicleFilters();
        }
    });

    nextVehiclePageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
        if (currentVehiclePage < totalPages) {
            currentVehiclePage++;
            applyVehicleFilters();
        }
    });

    const applyVehicleFilters = () => {
        const searchTerm = vehicleSearchInput.value.toLowerCase();
        const statusFilter = vehicleStatusFilter.value;

        filteredVehicles = allVehicles.filter(vehicle => {
            const matchesSearch = Object.values(vehicle).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
            const matchesStatus = statusFilter === '' || vehicle.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        currentVehiclePage = 1; // Reset to first page on new filter
        renderVehiclesTable(filteredVehicles);
    };

    vehicleSearchInput.addEventListener('input', applyVehicleFilters);
    vehicleStatusFilter.addEventListener('change', applyVehicleFilters);
    addVehicleBtn.addEventListener('click', () => openAddEditVehicleModal(null));


    // --- Lógica de Modales de Vehículos ---
    const openVehicleDetails = (vehicleId) => {
        const vehicle = allVehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            document.getElementById('detailVehicleId').textContent = vehicle.id;
            document.getElementById('detailVehicleType').textContent = vehicle.type;
            document.getElementById('detailVehicleModel').textContent = vehicle.model;
            document.getElementById('detailVehicleLicensePlate').textContent = vehicle.licensePlate;
            document.getElementById('detailVehicleCapacity').textContent = vehicle.capacity;
            document.getElementById('detailVehicleStatus').innerHTML = `<span class="status-badge ${getStatusBadgeClass(vehicle.status)}">${vehicle.status}</span>`;
            document.getElementById('detailVehicleLastMaintenance').textContent = formatDate(vehicle.lastMaintenance);
            document.getElementById('detailVehicleMaintenanceHistory').textContent = vehicle.maintenanceHistory;
            vehicleDetailModal.classList.add('active');
            vehicleDetailModal.dataset.vehicleId = vehicleId; // Store ID for editing
        }
    };

    const openAddEditVehicleModal = (vehicleId = null) => {
        const form = document.getElementById('addEditVehicleForm');
        form.reset(); // Clear form
        document.getElementById('vehicleEditId').value = ''; // Clear hidden ID

        if (vehicleId) {
            // Edit existing vehicle
            const vehicle = allVehicles.find(v => v.id === vehicleId);
            if (vehicle) {
                vehicleModalTitle.textContent = `Editar Vehículo ${vehicleId}`;
                document.getElementById('vehicleEditId').value = vehicle.id;
                document.getElementById('vehicleType').value = vehicle.type;
                document.getElementById('vehicleModel').value = vehicle.model;
                document.getElementById('vehicleLicensePlate').value = vehicle.licensePlate;
                document.getElementById('vehicleCapacity').value = vehicle.capacity;
                document.getElementById('vehicleStatus').value = vehicle.status;
                document.getElementById('vehicleLastMaintenance').value = vehicle.lastMaintenance;
                document.getElementById('vehicleMaintenanceHistory').value = vehicle.maintenanceHistory;
            }
        } else {
            // Add new vehicle
            vehicleModalTitle.textContent = 'Añadir Nuevo Vehículo';
        }
        closeModals(); // Close any other open modals first
        addEditVehicleModal.classList.add('active');
    };

    editVehicleDetailsBtn.addEventListener('click', () => {
        const vehicleId = vehicleDetailModal.dataset.vehicleId;
        closeModals(); // Close details modal
        openAddEditVehicleModal(vehicleId);
    });


    addEditVehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('vehicleEditId').value;
        const type = document.getElementById('vehicleType').value;
        const model = document.getElementById('vehicleModel').value;
        const licensePlate = document.getElementById('vehicleLicensePlate').value;
        const capacity = parseInt(document.getElementById('vehicleCapacity').value);
        const status = document.getElementById('vehicleStatus').value;
        const lastMaintenance = document.getElementById('vehicleLastMaintenance').value;
        const maintenanceHistory = document.getElementById('vehicleMaintenanceHistory').value;

        if (id) {
            // Actualizar vehículo existente
            const index = allVehicles.findIndex(v => v.id === id);
            if (index !== -1) {
                allVehicles[index] = { id, type, model, licensePlate, capacity, status, lastMaintenance, maintenanceHistory };
                alert(`Vehículo ${id} actualizado exitosamente.`);
            }
        } else {
            // Añadir nuevo vehículo
            const newId = 'VEH-' + String(allVehicles.length + 1001).padStart(4, '0'); // Simple ID generation
            allVehicles.push({ id: newId, type, model, licensePlate, capacity, status, lastMaintenance, maintenanceHistory });
            alert(`Vehículo ${newId} añadido exitosamente.`);
        }
        closeModals();
        applyVehicleFilters(); // Re-renderizar la tabla para mostrar los cambios
    });


    // --- Lógica para Eliminar Vehículo ---
    const deleteVehicle = (vehicleId) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el vehículo con ID ${vehicleId}? Esta acción no se puede deshacer.`)) {
            allVehicles = allVehicles.filter(v => v.id !== vehicleId);
            alert(`Vehículo ${vehicleId} eliminado.`);
            applyVehicleFilters(); // Re-renderizar la tabla
        }
    };


    // --- Lógica del Dashboard (Charts) ---
    let shipmentsStatusChart;
    let monthlyShipmentsChart;
    let topOriginsChart;

    const renderDashboardCharts = () => {
        // Prepare data for charts
        const statusCounts = allShipments.reduce((acc, shipment) => {
            acc[shipment.status] = (acc[shipment.status] || 0) + 1;
            return acc;
        }, {});

        const monthlyCounts = allShipments.reduce((acc, shipment) => {
            const month = new Date(shipment.shipmentDate).toLocaleString('es-ES', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const originCounts = allShipments.reduce((acc, shipment) => {
            acc[shipment.origin] = (acc[shipment.origin] || 0) + 1;
            return acc;
        }, {});

        // Chart.js Destroy existing charts if they exist
        if (shipmentsStatusChart) shipmentsStatusChart.destroy();
        if (monthlyShipmentsChart) monthlyShipmentsChart.destroy();
        if (topOriginsChart) topOriginsChart.destroy();

        // Envíos por Estado (Pie Chart)
        const statusLabels = Object.keys(statusCounts);
        const statusData = Object.values(statusCounts);
        const statusColors = statusLabels.map(label => {
            switch (label) {
                case 'En Ruta': return '#3498db';
                case 'Entregado': return '#27ae60';
                case 'Pendiente': return '#f39c12';
                case 'Retrasado': return '#e74c3c';
                case 'Cancelado': return '#95a5a6';
                default: return '#cccccc';
            }
        });

        const ctxStatus = shipmentsStatusChartCanvas.getContext('2d');
        shipmentsStatusChart = new Chart(ctxStatus, {
            type: 'pie',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusData,
                    backgroundColor: statusColors,
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // We'll create a custom legend
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
        // Custom legend generation
        generateCustomLegend(statusLabels, statusColors, shipmentsStatusChartLegend);

        // Envíos Mensuales (Line Chart)
        const monthlyLabels = Object.keys(monthlyCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const monthlyData = monthlyLabels.map(label => monthlyCounts[label]);

        const ctxMonthly = monthlyShipmentsChartCanvas.getContext('2d');
        monthlyShipmentsChart = new Chart(ctxMonthly, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: 'Envíos',
                    data: monthlyData,
                    borderColor: varStyles.getPropertyValue('--primary-color'), // Use CSS variable
                    backgroundColor: 'rgba(93, 93, 143, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Mes', color: varStyles.getPropertyValue('--text-color') }
                    },
                    y: {
                        title: { display: true, text: 'Total de Envíos', color: varStyles.getPropertyValue('--text-color') },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) { if (Number.isInteger(value)) { return value; } }
                        }
                    }
                }
            }
        });

        // Top Orígenes de Envíos (Bar Chart)
        const sortedOrigins = Object.entries(originCounts).sort(([, a], [, b]) => b - a).slice(0, 5); // Top 5
        const originLabels = sortedOrigins.map(([origin]) => origin);
        const originData = sortedOrigins.map(([, count]) => count);

        const ctxOrigins = topOriginsChartCanvas.getContext('2d');
        topOriginsChart = new Chart(ctxOrigins, {
            type: 'bar',
            data: {
                labels: originLabels,
                datasets: [{
                    label: 'Número de Envíos',
                    data: originData,
                    backgroundColor: varStyles.getPropertyValue('--accent-color'), // Use CSS variable
                    borderColor: varStyles.getPropertyValue('--accent-color'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Origen', color: varStyles.getPropertyValue('--text-color') }
                    },
                    y: {
                        title: { display: true, text: 'Total de Envíos', color: varStyles.getPropertyValue('--text-color') },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) { if (Number.isInteger(value)) { return value; } }
                        }
                    }
                }
            }
        });
    };

    const varStyles = getComputedStyle(document.documentElement); // Helper to get CSS variables
    const generateCustomLegend = (labels, colors, legendContainer) => {
        legendContainer.innerHTML = '';
        labels.forEach((label, index) => {
            const item = document.createElement('div');
            item.classList.add('chart-legend-item');
            const colorBox = document.createElement('span');
            colorBox.classList.add('chart-legend-color-box');
            colorBox.style.backgroundColor = colors[index];
            const text = document.createTextNode(label);
            item.appendChild(colorBox);
            item.appendChild(text);
            legendContainer.appendChild(item);
        });
    };

    const updateDashboardKPIs = () => {
        const total = allShipments.length;
        const inTransit = allShipments.filter(s => s.status === 'En Ruta').length;
        const delivered = allShipments.filter(s => s.status === 'Entregado').length;
        const delayed = allShipments.filter(s => s.status === 'Retrasado').length;

        kpiTotalShipments.textContent = total;
        kpiInTransit.textContent = inTransit;
        kpiDelivered.textContent = delivered;
        kpiDelayed.textContent = delayed;
    };

    applyDateFilterBtn.addEventListener('click', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (startDate && endDate) {
            const filteredByDate = allShipments.filter(shipment => {
                const shipmentDate = new Date(shipment.shipmentDate);
                return shipmentDate >= new Date(startDate) && shipmentDate <= new Date(endDate);
            });
            // Temporarily update allShipments for chart rendering
            let originalShipments = allShipments;
            allShipments = filteredByDate;
            updateDashboardKPIs();
            renderDashboardCharts();
            allShipments = originalShipments; // Revert for other operations
        } else {
            alert('Por favor, selecciona tanto la fecha de inicio como la de fin.');
        }
    });

    resetDateFilterBtn.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';
        updateDashboardKPIs(); // Recalculate KPIs with all shipments
        renderDashboardCharts(); // Re-render charts with all shipments
    });

    // --- Inicialización ---
    // Mostrar la sección de Dashboard por defecto y renderizar sus elementos
    // La inicialización del mapa y la aplicación de filtros en envíos se manejarán en showSection
    showSection('dashboard');

    // Inicializar las tablas y gráficos al cargar la página
    applyFilters(); // Para envíos (llamará a la lógica del mapa si la sección 'envios' está activa)
    applyVehicleFilters(); // Para vehículos
    updateDashboardKPIs(); // Actualizar los KPIs al inicio
    renderDashboardCharts(); // Renderizar gráficos al inicio

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === shipmentDetailsModal) {
            closeModals();
        }
        if (event.target === editShipmentModal) {
            closeModals();
        }
        if (event.target === vehicleDetailModal) {
            closeModals();
        }
        if (event.target === addEditVehicleModal) {
            closeModals();
        }
    });
});