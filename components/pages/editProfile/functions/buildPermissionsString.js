function buildPermissionsString ({ permission, resources }) {
  const stringValues = [];

  for (const type in permission.listPermissions) {
    const permissions = permission.listPermissions[type];

    for (const action in permissions) {
      if (action !== 'view') {
        const value = permissions[action];

        if (typeof value === 'string') {
          stringValues.push(value);
        }
      }
    }
  }

  for (const type in permission.listPermissions) {
    const permissions = permission.listPermissions[type];

    switch (type) {
    case 'Projetos': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_expedition');
        resourcesRequired.add('view_assembly');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_project');
      }

      if (permissions.see) {
        resourcesRequired.add('view_expedition');
        resourcesRequired.add('view_assembly');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_furniture');
        resourcesRequired.add('view_workerTask');
        resourcesRequired.add('see_budget');
      }

      if (permissions.update) {
        resourcesRequired.add('change_expedition');
        resourcesRequired.add('change_assembly');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_project');
        resourcesRequired.add('change_budget');
        resourcesRequired.add('change_project');
        resourcesRequired.add('update_budget');
        resourcesRequired.add('change_furniture');
        resourcesRequired.add('add_furniture');
        //
        resourcesRequired.add('change_consumable');
        resourcesRequired.add('delete_furniture');
      }

      if (permissions.create) {
        resourcesRequired.add('add_project');
        resourcesRequired.add('add_budget');
        resourcesRequired.add('add_furniture');
        resourcesRequired.add('add_expedition');
        resourcesRequired.add('add_assembly');
        resourcesRequired.add('view_owner');
      }

      if (permissions.delete) {
        resourcesRequired.add('delete_budget');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Projetos Similares': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_expedition');
        resourcesRequired.add('view_assembly');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_furniture');
        resourcesRequired.add('view_workerTask');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Stocks': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_leftover');
        resourcesRequired.add('view_stock');
      }

      if (permissions.see) {
        resourcesRequired.add('view_stock');
      }

      if (permissions.create) {
        resourcesRequired.add('add_stock');
      }

      if (permissions.update) {
        resourcesRequired.add('change_stock');
      }

      if (permissions.delete) {
        resourcesRequired.add('delete_stock');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Mensagens': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_message');
        resourcesRequired.add('list_message');
      }

      if (permissions.create) {
        resourcesRequired.add('add_message');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Máquinas': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_machine');
      }

      if (permissions.see) {
        resourcesRequired.add('view_machine');
        resourcesRequired.add('view_workerTask');
        resourcesRequired.add('view_worker');
      }

      if (permissions.update) {
        resourcesRequired.add('change_machine');
        resourcesRequired.add('view_machine');
      }

      if (permissions.create) {
        resourcesRequired.add('view_organization');
        resourcesRequired.add('view_machine');
        resourcesRequired.add('add_machine');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Chão de Fábrica': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_machine');
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_furniture');
      }

      if (permissions.see) {
        resourcesRequired.add('view_machine');
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('view_furniture');
        resourcesRequired.add('view_workerTask');
        resourcesRequired.add('view_part');
        resourcesRequired.add('view_consumable');
      }

      if (permissions.create) {
        resourcesRequired.add('add_workerTask');
        resourcesRequired.add('change_workerTask');
        resourcesRequired.add('change_machine');
        resourcesRequired.add('change_part');
        resourcesRequired.add('change_project');
        resourcesRequired.add('add_factory');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Montagens': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_module');
        resourcesRequired.add('add_module');
      }

      if (permissions.create) {
        resourcesRequired.add('change_module');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Ficheiros': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_file');
      }

      if (permissions.create) {
        resourcesRequired.add('add_file');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Embalamentos': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_budget');
      }

      if (permissions.create) {
        resourcesRequired.add('view_part');
        resourcesRequired.add('view_project');
        resourcesRequired.add('view_budget');
        resourcesRequired.add('add_package');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Clientes': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_owner');
        resourcesRequired.add('list_client');
      }

      if (permissions.see) {
        resourcesRequired.add('view_owner');
        resourcesRequired.add('see_client');
      }

      if (permissions.create) {
        resourcesRequired.add('create_owner');
        resourcesRequired.add('create_client');
        resourcesRequired.add('add_owner');
        resourcesRequired.add('add_client');
        resourcesRequired.add('view_organization');
      }

      if (permissions.update) {
        resourcesRequired.add('change_owner');
        resourcesRequired.add('update_client');
        resourcesRequired.add('change_client');
        resourcesRequired.add('view_organization');
      }

      if (permissions.delete) {
        resourcesRequired.add('delete_owner');
        resourcesRequired.add('delete_client');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Utilizadores': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_worker');
        resourcesRequired.add('view_group');
      }

      if (permissions.see) {
        resourcesRequired.add('view_owner');
      }

      if (permissions.create) {
        resourcesRequired.add('create_worker');
        resourcesRequired.add('add_worker');
        resourcesRequired.add('add_owner');
        resourcesRequired.add('view_organization');
        resourcesRequired.add('change_group');
      }

      if (permissions.update) {
        resourcesRequired.add('change_group');
        resourcesRequired.add('change_worker');
        resourcesRequired.add('view_organization');
      }

      if (permissions.delete) {
        resourcesRequired.add('delete_owner');
        resourcesRequired.add('delete_client');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Perfis': {
      const resourcesRequired = new Set();

      if (permissions.list) {
        resourcesRequired.add('view_group');
        resourcesRequired.add('view_group');
      }

      if (permissions.see) {
        resourcesRequired.add('view_group');
        resourcesRequired.add('view_owner');
      }

      if (permissions.create) {
        resourcesRequired.add('view_group');
        resourcesRequired.add('change_group');
        resourcesRequired.add('view_permission');
      }

      if (permissions.update) {
        resourcesRequired.add('change_group');
        resourcesRequired.add('view_group');
      }

      if (permissions.delete) {
        resourcesRequired.add('delete_group');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }

    case 'Conta': {
      const resourcesRequired = new Set();

      if (permissions.see) {
        resourcesRequired.add('view_owner');
      }

      resourcesRequired.forEach(codename => {
        const resource = resources.find(ele => ele.codename === codename);

        if (resource && !stringValues.includes(resource.id)) {
          stringValues.push(resource.id);
        }
      });

      break;
    }
    }
  }

  return stringValues;
}

export default buildPermissionsString;
