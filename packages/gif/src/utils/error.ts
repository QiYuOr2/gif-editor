export enum StatusType {
  Success,
  DecodeError
}

const StatusMessage: Record<StatusType, string> = {
  [StatusType.Success]: "success",
  [StatusType.DecodeError]: 'decode error',
}

export function message(status: StatusType, message?: string) {
  return `[@ge - ${status}]: ${StatusMessage[status]}${message ? ` - ${message}`: ''}`
}