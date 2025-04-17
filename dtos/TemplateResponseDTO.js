export class TemplateResponseDTO {
  constructor(template) {
    // Convert _id to id and filter unnecessary fields
    this.id = template?._id || template?.id || null;
    this.type = template?.type || 'unknown';
    this.content = template?.content || '';
    this.labels = template?.labels || [];
    this.author = template?.author || 'anonymous';
    this.createdAt = template?.createdAt || new Date();
  }
}
