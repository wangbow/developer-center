import {
	Component
} from 'react';

import './index.less';

class ErrorMessage extends Component {


	render() {

		let {
			infoList
		} = this.props;

		let infoTds = "",
			table = "";

		if (infoList && infoList.ip && infoList.ip.length > 0) {
			infoTds = infoList.ip.map((item, i) =>

				<tr>
					<td>{item}</td>
					<td>{infoList.message[i]}</td>
				</tr>
			);
		}

		if (infoTds) {

			table = <table  className="error-message">
						<thead>
							<tr>
								<th width="150">ip</th>
								<th width="150">message</th>
							</tr>
						</thead>
						<tbody>

							{infoTds}
							
						</tbody>
						
				</table>
		}

		return (

			<div className="error-container">
			{table}
			</div>

		)

	}
}

export default ErrorMessage;