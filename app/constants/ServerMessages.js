export const ServerErrors = {
	GENERAL_ERROR: `General Error from catch statment`,
	DB_FIND_ERROR: `Error while finding model find model`,
	API_BASE_CREATE_FAIL: 'Item creation failed, check params match schema',
	API_BASE_CREATE_INVALID:
		'Could not create object, missing body data / wrong format',
	API_BASE_UPDATE_FAIL: 'Item update failed, check params match schema',
	API_BASE_UPDATE_INVALID:
		'Could not create object, missing body data / wrong format',
	API_BASE_DELETE_FAIL: 'Item delete failed, check params match schema',
	API_BASE_NO_IDENTIFIER:
		'Identifier value was not found in request / defined in controller',
};

export const ServerMessages = {
	API_BASE_CREATE_SUCCESS: 'Item created successfully',
	API_BASE_UPDATE_SUCCESS: 'Item updated successfully',
	API_BASE_DELETE_SUCCESS: 'Item deleted successfully',
};

export const ServerLoginMessages = {
	TOKEN_REQUIRED: 'A token is required for authentication',
	USER_NOT_FOUND_OR_EXP_TOKEN: 'User not found or Token expired',
	INVALID_TOKEN: 'Invalid Token',
	CANT_FIND_USER: "Phone number doesn't exist, or user isn't active",
	WRONG_OTP: 'Wrong confirmation code',
	ERROR_PARSING_TOKEN: 'Error parsing token',
	FIELD_NOT_VALID: 'Field not valid',
	FAILED_TO_SEND_SMS: 'Failed to send SMS',
	NOT_ALLOWED: 'User not allowed to access this api',
	TO_MANY_SMS_TRYS: 'To many trys to login, call support',
};
