from flask import Blueprint, request, jsonify
from services.schedule_service import ScheduleService

schedule_bp = Blueprint("schedules", __name__)

@schedule_bp.route("/schedules", methods=["POST"])
def create_schedule():
    data = request.json
    schedule = ScheduleService.create_schedule(
        practitioner_id=data["practitioner_id"],
        unavailable_date=data["unavailable_date"],
        start_time=data["start_time"],
        end_time=data["end_time"]
    )
    return jsonify({"message": "Schedule created", "schedule_id": schedule.schedule_id}), 201


@schedule_bp.route("/schedules/<int:practitioner_id>", methods=["GET"])
def get_schedules(practitioner_id):
    schedules = ScheduleService.get_schedules_by_practitioner(practitioner_id)
    return jsonify([{
        "schedule_id": schedule.schedule_id,
        "practitioner_id": schedule.practitioner_id,
        "unavailable_date": schedule.unavailable_date,
        "start_time": schedule.start_time,
        "end_time": schedule.end_time
    } for schedule in schedules]), 200


@schedule_bp.route("/schedules/<int:schedule_id>", methods=["PUT"])
def update_schedule(schedule_id):
    data = request.json
    schedule = ScheduleService.update_schedule(
        schedule_id=schedule_id,
        unavailable_date=data["unavailable_date"],
        start_time=data["start_time"],
        end_time=data["end_time"]
    )
    return jsonify({"message": "Schedule updated", "schedule_id": schedule.schedule_id}), 200


@schedule_bp.route("/schedules/<int:schedule_id>", methods=["DELETE"])
def delete_schedule(schedule_id):
    ScheduleService.delete_schedule(schedule_id)
    return jsonify({"message": "Schedule deleted"}), 200
