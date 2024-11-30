class AssistantRepository:
    def is_associated(self, assistant_id, practitioner_id):
        return bool(
            Assistant.query.filter_by(
                assistant_id=assistant_id, practitioner_id=practitioner_id
            ).first()
        )
