
import pytest
from unittest.mock import MagicMock, patch
from appointment_service.services.appointment_service import AppointmentService

@pytest.fixture
def appointment_service():
    return AppointmentService()

@patch("services.appointment_service.validate_appointment_data")
@patch("services.appointment_service.check_availability")
@patch("services.appointment_service.check_schedule")
@patch("repositories.appointment_repository.AppointmentRepository.create")
@patch("common.repositories.assistant_repository.AssistantRepository.is_associated")
def test_create_appointment_success(
    mock_is_associated,
    mock_create,
    mock_check_schedule,
    mock_check_availability,
    mock_validate_data,
    appointment_service
):
    # Mock des retours des dépendances
    mock_validate_data.return_value = {"success": True}
    mock_is_associated.return_value = True
    mock_check_availability.return_value = True
    mock_check_schedule.return_value = True
    mock_create.return_value = {"success": True, "appointment_id": 1}

    # Données pour le test
    data = {
        "practitioner_id": 2,
        "appointment_date": "2024-11-15T10:00:00",
        "duration": 30
    }
    user_id = 1
    role = "assistant"

    # Appel de la méthode
    result = appointment_service.create_appointment(data, user_id, role)

    # Assertions
    assert result["success"] is True
    assert result["appointment_id"] == 1
    mock_validate_data.assert_called_once_with(data)
    mock_is_associated.assert_called_once_with(user_id, 2)
    mock_check_availability.assert_called_once_with(2, "2024-11-15T10:00:00")
    mock_check_schedule.assert_called_once_with(2, "2024-11-15T10:00:00")
    mock_create.assert_called_once_with(data)

def test_create_appointment_missing_user_or_role(appointment_service):
    # Données incomplètes
    data = {
        "practitioner_id": 2,
        "appointment_date": "2024-12-15T10:00:00",
        "duration": 30,
        "patient_id": 1,
        "intervention_type_id": 1,
        "status": "scheduled"
    }
    user_id = None
    role = None

    # Appel de la méthode
    result = appointment_service.create_appointment(data, user_id, role)

    # Assertions
    assert result["success"] is False
    assert result["error"] == "Missing user_id or role"
    
def test_create_appointment_missing_patient_id(appointment_service):
    data = {
        "practitioner_id": 2,
        "appointment_date": "2024-12-15T10:00:00",
        "duration": 30,
        "patient_id": 1,
        "intervention_type_id": 1,
        "status": "scheduled"
    }
    
    user_id = 3
    role = "practitioner"

    result = appointment_service.create_appointment(data, user_id, role)
    assert result["success"] is False
    assert result["error"] == "Missing required field: patient_id"
