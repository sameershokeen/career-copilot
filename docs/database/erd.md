# Database ERD

See the full Entity Relationship Diagram in the [database-schema.md](../database-schema.md) file.

The ERD covers all 18 models and their relationships including:
- User → Resume → Match → Job → Company
- Application → FollowUp / Interview / Note
- Skill ↔ JobSkill / UserSkill (many-to-many)
- Vector embeddings for semantic search
