class RenderTable {

	constructor(el) {
		_this = this
		this.el = el
		this.selectedRows = []
		this.selectedGroups = []
		this.addEvents()
		this.multiSelectRows = false
		this.multiSelectEl = []
		this.nonce = el.attr('data-table-nonce')
	}
	// Add the event listeners for each action
	addEvents() {
		_this = this
		// Select/deselect
		this.el.on('change', '.select-this-row', function() {
			let row_id = $(this).attr('data-row-id')
			_this.selectRow(row_id)
		})
		// open actions
		this.el.on('click', '.open-actions', function() {
			let element = $(this).parent('tr')
			let row_id = element.attr('data-id')
			_this.openActions(row_id, element)
		})
		// Select/deselect groups (single)
		this.el.on('change', '#open-action input[type="checkbox"]', function() {
			let group_id = $(this).attr('data-group-id')
			_this.selectGroup(group_id)
		})
		// Save actions
		this.el.on('click', '#save-actions', function() {
			let row_id = $(this).attr('data-row-id')
			_this.saveActions(row_id)
		})
		// Close actions
		this.el.on('click', '#close-action', function() {
			_this.closeActions()
		})
		//Save multi select
		$('body').on('click', '#save-multi-select', function() {
			_this.saveMultiRows()
		})
		// Close multi select
		$('body').on('click', '#close-multi-select', function() {
			_this.offSelectRows()
		})
		// Select/deselect groups (multi)
		$('body').on('change', '#multi-select-groups .select-this-group', function() {
			let group_id = $(this).attr('data-group-id')
			_this.selectGroup(group_id)
		})
	}
	// Render the elements in the table
	render() {

		let html = ''

		for (let [i, val] of Object.entries(seTeachersData['teachersData'])) {

			html += `<tr data-id="${val.id}"><td class="se-user-table__select"><label for="row-id-${val.id}" class="checkbox"><input type="checkbox" class="select-this-row" data-row-id="${val.id}" id="row-id-${val.id}" /><span class="checkbox__button"></span></label></td><td>${val.first_name} ${val.last_name}</td>`
			html += `<td>`

			if (val.groups === false) {
				html += '<i>None</i>'
			}
			else {
				let it = 0
				$.each(val.groups, function(index, value) {
					console.log(seTeachersData['groupsData'][value])
					if (typeof seTeachersData['groupsData'][value] != 'undefined') {
						html += (it + 1 != Object.keys(val.groups).length) ? seTeachersData['groupsData'][value] + ', ' : seTeachersData['groupsData'][value]
					}
					it++
				})
			}
			html += `</td><td class="open-actions se-user-table__actions"><i class="se-action-icon se-icons"></i></td>`
			html += `</td></tr>`

		}

		this.el.html(html)
	}
	// Add row to user's selecion
	selectRow(row_id) {
		if (this.selectedRows.indexOf(row_id) !== -1) {
			this.deselectRow(row_id)
		}
		else {
			this.selectedRows.push(row_id)
			console.log('Selected rows:', this.selectedRows)
		}
		this.onSelectRows()
	}
	// Remove row from user's selection
	deselectRow(row_id) {
		console.log(row_id)
		let index = this.selectedRows.indexOf(row_id)
		this.selectedRows.splice(index, 1)
		console.log('DeSelected rows:', this.selectedRows)
		if (this.selectedRows.length === 0) this.offSelectRows()
	}
	// Add group to user's selection
	selectGroup(group_id) {
		if (this.selectedGroups.indexOf(group_id) !== -1) {
			this.deselectGroup(group_id)
		}
		else {
			this.selectedGroups.push(group_id)
			console.log('Select group:', this.selectedGroups)
		}
	}
	// Remove group from user's selection
	deselectGroup(group_id) {
		let index = this.selectedGroups.indexOf(group_id)
		this.selectedGroups.splice(index, 1)
		console.log('Deselect group:', this.selectedGroups)
	}
	// Clear group selection
	deselectAllGroups() {
		this.selectedGroups = []
	}
	// Get all groups
	getGroups() {
		return seTeachersData['groupsData']
	}
	// Load the actions for single row
	openActions(row_id, element) {
		this.deselectAllGroups()
		let html = '<div id="open-action" class="white-bg border-radius box-shadow padding" style="position:absolute;right: 0; z-index: 99;">'
		let groups = this.getGroups()

		let teachersGroups = seTeachersData.teachersData[row_id].groups

		if (typeof teachersGroups == 'object') teachersGroups = Object.values(teachersGroups)

		for (let [index, value] of Object.entries(groups)) {
			if (typeof teachersGroups == 'object' && teachersGroups.indexOf(index) !== -1) {
				html += `<label class="checkbox" for="group-${index}">${value}<input type="checkbox" checked id="group-${index}" data-group-id="${index}" class="select-this-group"><span class="checkbox__button"></span></label><br />`
				_this.selectGroup(index)
			}
			else {
				html += `<label class="checkbox" for="group-${index}">${value}<input type="checkbox" id="group-${index}" data-group-id="${index}" /><span class="checkbox__button"></span></label><br />`
			}
		}
		html += `<button id="save-actions" data-row-id="${row_id}">Save</button> <button class="grey" id="close-action">Close</button</div>`
		element.append(html)
	}
	// Close all open actions
	closeActions() {
		this.el.find('#open-action').remove()
		this.deselectAllGroups()
		console.log('closing actions')
	}
	// Save any changes under actions
	saveActions(row_id) {
		_this = this
		let group_ids = _this.selectedGroups

		$.ajax({
			url: ajaxUrl.ajax_url,
			type: 'POST',
			data: {
				action: 'se_update_teachers_groups',
				teacher_id: row_id,
				group_ids: group_ids,
				wp_nonce: _this.nonce
			},
			dataType: "json",
			success: response => {
				console.log(response)
				seTeachersData = response.data
				_this.render()
				const rePaginate = new TablePaginate(seTableTarget, 20)
				rePaginate.render()
			}
		})
	}
	// If multi select rows, open bulk actions
	onSelectRows() {
		if (this.selectedRows.length >= 1 && !this.multiSelectRows) {
			this.multiSelectRows = true
			let groups = this.getGroups()
			let html = `<div id="multi-select-groups" class="grid blue-bg border-radius fade-in"><div class="container-inner"><div class="padding--l-y"><div class="text-center"><h3 class="no-pad-marg">Add to Groups</h3></div><div class="padding-md-y">`
			for (let [index, value] of Object.entries(groups)) {
				html += `<label class="checkbox grid__cell 1/2 1/4--handheld-and-up" for="group_${index}">${value}<input type="checkbox" id="group_${index}" data-group-id="${index}" class="select-this-group" /><span class="checkbox__button"></span></label> `
			}
			html += `</div><div class="text-center grid__cell"><button id="save-multi-select" class="green">Save</button> <button id="close-multi-select">Close</button></div></div></div></div>`
			this.el.parents('table').before(html)
		}
	}
	// Remove bulk actions
	offSelectRows() {
		this.multiSelectRows = false
		this.selectedGroups = []
		$('body').find('#multi-select-groups').remove()
	}
	// Save bulk actions
	saveMultiRows() {
		_this = this
		let teacher_ids = _this.selectedRows
		let group_ids = _this.selectedGroups

		$.ajax({
			url: ajaxUrl.ajax_url,
			type: 'POST',
			data: {
				action: 'se_update_multi_teachers_groups',
				teacher_ids: teacher_ids,
				group_ids: group_ids,
				wp_nonce: _this.nonce
			},
			dataType: "json",
			success: response => {
				seTeachersData = response.data
				_this.render()
				const rePaginate = new TablePaginate(seTableTarget, 20)
				rePaginate.render()
			}
		})
	}
	// Re-render the table
	update() {
		this.render()
		const rePaginate = new TablePaginate(seTableTarget, 20)
		rePaginate.render()
	}
}

// Pagnination

class TablePaginate {

	constructor(el, perPage, currentPage = 1) {
		let _this = this
		this.el = el
		this.paginateTarget = $('#paginate-target')
		this.perPage = perPage
		this.currentPage = currentPage
		this.paginateTarget.on('click', '.paginate-page', function() {
			let page = $(this).attr('data-page')
			_this.getPage(page)
		})
	}
	// Render the pagination 
	render() {
		$(this.el).find('tr').hide()
		let rowsToShow = $(this.el).find('tr').slice(((this.perPage * this.currentPage) - this.perPage), (this.currentPage * this.perPage))
		rowsToShow.show()
	}
	// Navigate to page
	getPage(pageNum) {
		this.currentPage = pageNum
		this.render()
	}
	// Add the pagination links
	addLinks() {
		let pages = Math.ceil(this.el.find('tr').length / this.perPage)

		console.log('Pages', pages)

		let html = ''

		if (pages <= 1) return

		for (let i = 1; i <= pages; i++) {
			html += `<span class="paginate-page page-numbers" data-page='${i}'>${i}</span> `
		}
		this.paginateTarget.append(html)
	}
}
